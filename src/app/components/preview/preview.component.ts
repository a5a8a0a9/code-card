import { Component, HostListener, inject, signal } from '@angular/core';
import { CardService } from '../../services/card.service';

@Component({
	selector: 'yo-preview',
	standalone: true,
	imports: [], // Signals are part of core
	templateUrl: './preview.component.html',
	styleUrl: './preview.component.scss',
})
export class PreviewComponent {
	cardService = inject(CardService);

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

	startDrag(event: MouseEvent | TouchEvent) {
		this.isDragging.set(true);
		// Stop auto-rotate if user interacts
		this.cardService.stopAutoRotate();

		const clientX =
			event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
		const clientY =
			event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

		this.dragStart = { x: clientX, y: clientY };
		this.lastRotation = { ...this.cardService.rotation() };
	}

	stopDrag() {
		this.isDragging.set(false);
	}

	@HostListener('window:resize')
	onResize() {
		this.calculateScale();
	}

	onDrag(event: MouseEvent | TouchEvent) {
		if (!this.isDragging()) return;

		if (event instanceof TouchEvent) {
			// event.preventDefault();
		}

		const clientX =
			event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
		const clientY =
			event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

		const deltaX = clientX - this.dragStart.x;
		const deltaY = clientY - this.dragStart.y;

		const newY = this.lastRotation.y + deltaX / 3;
		const newX = this.lastRotation.x - deltaY / 3;

		this.cardService.setRotation(newX, newY);
	}
}
