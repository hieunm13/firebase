import { Component } from '@angular/core';
import { Tutorial } from '../../models/tutorial.model';
import { TutorialService } from '../../services/tutorial.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrl: './tutorials-list.component.css',
})
export class TutorialsListComponent {
  tutorials?: Tutorial[];
  currentTutorial?: Tutorial;
  currentIndex = -1;
  title = '';

  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  refreshList(): void {
    this.currentTutorial = undefined;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) => {
          console.log('changes ', changes);
          return changes.map((c) => {
            console.log('c ', c.payload.key);
            console.log('value ', c.payload.val());
            return {
              key: c.payload.key,
              ...c.payload.val(),
            };
          });
        })
      )
      .subscribe((data) => {
        console.log('data ', data);
        this.tutorials = data;
      });
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService
      .deleteAll()
      .then(() => this.refreshList())
      .catch((err) => console.log(err));
  }
}
