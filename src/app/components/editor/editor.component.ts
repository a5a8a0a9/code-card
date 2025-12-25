import { Component, inject, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
} from '@angular/forms';
import { CardService } from '../../services/card.service';

@Component({
	selector: 'yo-editor',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './editor.component.html',
	styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit {
	cardService = inject(CardService);
	fb = new FormBuilder();

	cardForm: FormGroup = new FormGroup({
		name: new FormControl(this.cardService.initialProfile.name),
		title: new FormControl(this.cardService.initialProfile.title),
		email: new FormControl(this.cardService.initialProfile.email),
		phone: new FormControl(this.cardService.initialProfile.phone),
		skills: new FormControl(this.cardService.initialProfile.skills),
		status: new FormControl(this.cardService.initialProfile.status),
	});

	ngOnInit() {
		// Sync form changes to service
		this.cardForm.valueChanges.subscribe((value) => {
			this.cardService.updateProfile(value);
		});
	}
}
