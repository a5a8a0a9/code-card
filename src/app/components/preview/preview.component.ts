import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	faPause,
	faPen,
	faPlay,
	faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { CardService } from '../../services/card.service';

@Component({
	selector: 'yo-preview',
	standalone: true,
	imports: [FontAwesomeModule], // Signals are part of core
	templateUrl: './preview.component.html',
	styleUrl: './preview.component.scss',
})
export class PreviewComponent {
	cardService = inject(CardService);

	// Icons
	faRotateRight = faRotateRight;
	faPlay = faPlay;
	faPause = faPause;
	faPen = faPen;

	lineNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
	scale = signal(1);

	constructor() {
		this.calculateScale();
	}

	calculateScale() {
		// Only scale on mobile (< 1024px)
		if (typeof window !== 'undefined' && window.innerWidth < 1024) {
			const width = window.innerWidth;
			// Base width is 320px + some padding (e.g. 40px)
			const targetWidth = 360;
			// If screen is smaller than target, scale down
			if (width < targetWidth) {
				this.scale.set(width / targetWidth);
			} else {
				this.scale.set(1);
			}
		} else {
			this.scale.set(1);
		}
	}

	// Local state for dragging logic
	dragStart = { x: 0, y: 0 };
	lastRotation = { x: 0, y: 0 };
	isDragging = signal(false);

	getCardTransform() {
		const r = this.cardService.rotation();
		return `rotateX(${r.x}deg) rotateY(${r.y}deg)`;
	}

	onPointerDown(event: PointerEvent) {
		this.isDragging.set(true);
		this.cardService.stopAutoRotate();

		// Capture the pointer on the container (currentTarget) to ensure we track events
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

		this.dragStart = { x: event.clientX, y: event.clientY };
		this.lastRotation = { ...this.cardService.rotation() };
	}

	onPointerUp(event: PointerEvent) {
		this.isDragging.set(false);
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
	}

	onPointerMove(event: PointerEvent) {
		if (!this.isDragging()) return;

		const deltaX = event.clientX - this.dragStart.x;
		const deltaY = event.clientY - this.dragStart.y;

		// Reduced sensitivity (divide by 3)
		const newY = this.lastRotation.y + deltaX / 3;
		const newX = this.lastRotation.x - deltaY / 3;

		this.cardService.setRotation(newX, newY);
	}
}
