import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Database, ref, set, onValue } from '@angular/fire/database';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  constructor(public dialog: MatDialog, private database: Database) {}

  ngOnInit(): void {
    this.newGame();
    this.setupFirebaseSync();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() || '';
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
     
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.saveToFirebase();
      }, 1000);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });
    dialogRef.afterClosed().subscribe(name => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.saveToFirebase();
      }
    });
  }

  // Einfache Firebase-Synchronisation
  setupFirebaseSync() {
    const gameRef = ref(this.database, 'game/current');
    
    // Lädt Daten aus Firebase wenn sich etwas ändert
    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Daten von Firebase in lokales Spiel übernehmen
        this.game.players = data.players || this.game.players;
        this.game.stack = data.stack || this.game.stack;
        this.game.playedCards = data.playedCards || this.game.playedCards;
        this.game.currentPlayer = data.currentPlayer || this.game.currentPlayer;
        console.log('Spiel von Firebase synchronisiert:', data);
      }
    });
  }

  // Speichert aktuelles Spiel in Firebase
  saveToFirebase() {
    const gameRef = ref(this.database, 'game/current');
    const gameData = {
      players: this.game.players,
      stack: this.game.stack,
      playedCards: this.game.playedCards,
      currentPlayer: this.game.currentPlayer,
      lastUpdated: Date.now()
    };
    
    set(gameRef, gameData)
      .then(() => console.log('Spiel in Firebase gespeichert'))
      .catch((error) => console.error('Fehler beim Speichern:', error));
  }
}