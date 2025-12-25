
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'yo-root',
	imports: [ReactiveFormsModule],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	fb = new FormBuilder();

	// 用於模板中的行號陣列
	lineNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

	// 表單定義
	cardForm: FormGroup = this.fb.group({
		name: ['Alex Chen'],
		title: ['Frontend Engineer'],
		email: ['alex@example.com'],
		website: ['alex.dev'],
		github: ['alexcode'],
		skills: ['Angular, Tailwind, Three.js'],
	});

	// Signals for state
	rotation = signal({ x: -15, y: 15 }); // 初始稍微有點角度比較好看
	isDragging = signal(false);
	isAutoRotating = signal(false);

	// 拖曳起始點
	dragStart = { x: 0, y: 0 };
	lastRotation = { x: 0, y: 0 };

	// 自動旋轉的 Interval ID
	autoRotateInterval: any;

	// 用 Computed signal 處理技能字串轉陣列
	skillList = computed(() => {
		const raw: string = this.cardForm.get('skills')?.value || '';
		return raw
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	});

	constructor() {
		// 讓表單變更時自動偵測 (Angular 19 不需要太多額外設定，UI 會自動綁定)
	}

	// 取得卡片的 CSS Transform 字串
	getCardTransform() {
		const r = this.rotation();
		return `rotateX(${r.x}deg) rotateY(${r.y}deg)`;
	}

	// --- 互動邏輯 ---

	startDrag(event: MouseEvent | TouchEvent) {
		this.isDragging.set(true);
		// 停止自動旋轉如果使用者開始操作
		if (this.isAutoRotating()) {
			this.toggleAutoRotate();
		}

		const clientX =
			event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
		const clientY =
			event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

		this.dragStart = { x: clientX, y: clientY };
		this.lastRotation = { ...this.rotation() };
	}

	stopDrag() {
		this.isDragging.set(false);
	}

	onDrag(event: MouseEvent | TouchEvent) {
		if (!this.isDragging()) return;

		// 防止在手機上拖曳時捲動頁面
		if (event instanceof TouchEvent) {
			// event.preventDefault(); // 視情況開啟，可能會影響表單輸入
		}

		const clientX =
			event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
		const clientY =
			event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

		const deltaX = clientX - this.dragStart.x;
		const deltaY = clientY - this.dragStart.y;

		// 靈敏度調整：除以 5 讓旋轉比較平滑
		// RotateY 對應滑鼠 X 移動，RotateX 對應滑鼠 Y 移動 (且要反向)
		const newY = this.lastRotation.y + deltaX / 3;
		const newX = this.lastRotation.x - deltaY / 3;

		this.rotation.set({ x: newX, y: newY });
	}

	resetRotation() {
		this.rotation.set({ x: 0, y: 0 });
		this.isAutoRotating.set(false);
		clearInterval(this.autoRotateInterval);
	}

	toggleAutoRotate() {
		this.isAutoRotating.update((v) => !v);

		if (this.isAutoRotating()) {
			this.autoRotateInterval = setInterval(() => {
				this.rotation.update((curr) => ({
					x: curr.x, // 保持 X 軸傾斜
					y: curr.y + 0.5, // 慢慢水平旋轉
				}));
			}, 16); // ~60fps
		} else {
			clearInterval(this.autoRotateInterval);
		}
	}
}
