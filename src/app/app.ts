import { Component } from '@angular/core';
import { EditorComponent } from './components/editor/editor.component';
import { PreviewComponent } from './components/preview/preview.component';

@Component({
	selector: 'yo-root',
	imports: [EditorComponent, PreviewComponent],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {}
