import { Injectable, computed, effect, signal } from '@angular/core';

export interface CardProfile {
	name: string;
	title: string;
	email: string;
	phone: string;
	skills: string;
	status: string;
}

@Injectable({
	providedIn: 'root',
})
export class CardService {
	// 初始狀態
	readonly initialProfile: CardProfile = {
		name: 'Alex Chen',
		title: 'Frontend Engineer',
		email: 'alex@example.com',
		phone: '0912345678',
		skills: 'Angular, Tailwind, Three.js',
		status: 'Open to work',
	};

	// --- Data State ---
	private profileSignal = signal<CardProfile>(this.initialProfile);
	readonly profile = this.profileSignal.asReadonly();

	// --- UI State ---
	// 初始稍微有點角度比較好看
	readonly initialRotation = { x: -15, y: 15 };
	private rotationSignal = signal(this.initialRotation);
	readonly rotation = this.rotationSignal.asReadonly();

	private isAutoRotatingSignal = signal(false);
	readonly isAutoRotating = this.isAutoRotatingSignal.asReadonly();
	// UI Mode State
	private readonly isEditingSignal = signal(false);
	readonly isEditing = this.isEditingSignal.asReadonly();

	// Auto rotation interval reference
	private autoRotateInterval: any;

	constructor() {
		// Effect to handle auto-rotation logic
		effect((onCleanup) => {
			if (this.isAutoRotatingSignal()) {
				this.autoRotateInterval = setInterval(() => {
					this.rotationSignal.update((curr) => ({
						x: curr.x,
						y: curr.y + 0.5,
					}));
				}, 16);
			} else {
				clearInterval(this.autoRotateInterval);
			}

			onCleanup(() => {
				clearInterval(this.autoRotateInterval);
			});
		});
	}

	// --- Data Actions ---
	updateProfile(partial: Partial<CardProfile>) {
		this.profileSignal.update((current) => ({ ...current, ...partial }));
	}

	// --- UI Actions ---
	setRotation(x: number, y: number) {
		this.rotationSignal.set({ x, y });
	}

	updateRotation(deltaX: number, deltaY: number) {
		this.rotationSignal.update((curr) => ({
			x: curr.x + deltaX,
			y: curr.y + deltaY,
		}));
	}

	updateRotationDirect(newRotation: { x: number; y: number }) {
		this.rotationSignal.set(newRotation);
	}

	resetRotation() {
		this.rotationSignal.set({ x: 0, y: 0 });
		this.isAutoRotatingSignal.set(false);
	}

	toggleAutoRotate() {
		this.isAutoRotatingSignal.update((v) => !v);
	}

	toggleEditingMode() {
		this.isEditingSignal.update((v) => !v);
	}

	setEditingMode(isEditing: boolean) {
		this.isEditingSignal.set(isEditing);
	}

	stopAutoRotate() {
		if (this.isAutoRotatingSignal()) {
			this.isAutoRotatingSignal.set(false);
		}
	}

	// Comuted value for skills array
	readonly skillList = computed(() => {
		const raw = this.profile().skills || '';
		return raw
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	});
}
