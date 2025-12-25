import { Component, inject } from '@angular/core';
import { EditorComponent } from './components/editor/editor.component';
import { PreviewComponent } from './components/preview/preview.component';
import { CardService } from './services/card.service';

@Component({
	selector: 'yo-root',
	imports: [EditorComponent, PreviewComponent],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	cardService = inject(CardService);
}
