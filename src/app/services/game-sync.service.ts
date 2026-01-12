import { Injectable, OnDestroy } from '@angular/core';
import { Database, object, ref, set, update, remove, push } from '@angular/fire/database';
import { Game } from '../../models/game';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameSyncService implements OnDestroy {
  private gameRef: any;
  private gameSubscription: Subscription | null = null;
  private currentGameId: string | null = null;

  constructor(private database: Database) {}

  // Neues Spiel erstellen und mit Firebase synchronisieren
  createGame(game: Game): Promise<string> {
    const gamesRef = ref(this.database, 'games');
    const newGameRef = push(gamesRef);
    
    if (newGameRef.key) {
      this.currentGameId = newGameRef.key;
      return set(newGameRef, this.gameToFirebase(game)).then(() => {
        return newGameRef.key!;
      });
    }
    
    return Promise.reject('Fehler beim Erstellen des Spiels');
  }

  // Bestehendes Spiel laden und synchronisieren
  joinGame(gameId: string, callback: (game: Game) => void): void {
    this.currentGameId = gameId;
    this.gameRef = ref(this.database, `games/${gameId}`);
    
    // Echtzeit-Listener für Änderungen
    this.gameSubscription = object(this.gameRef).subscribe((snapshot) => {
      const gameData = snapshot.snapshot.val();
      if (gameData) {
        const game = this.firebaseToGame(gameData);
        callback(game);
      }
    });
  }

  // Spiel aktualisieren (lokale Änderungen werden zu Firebase gesendet)
  updateGame(game: Game): Promise<void> {
    if (!this.currentGameId) {
      return Promise.reject('Kein Spiel aktiv');
    }
    
    const gameRef = ref(this.database, `games/${this.currentGameId}`);
    return update(gameRef, this.gameToFirebase(game));
  }

  // Spiel löschen
  deleteGame(gameId: string): Promise<void> {
    const gameRef = ref(this.database, `gameId}`);
    return remove(gameRef);
  }

  // Synchronisation stoppen
  stopSync(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
      this.gameSubscription = null;
    }
    this.currentGameId = null;
  }

  // Konvertierung: Game-Objekt zu Firebase-Format
  private gameToFirebase(game: Game): any {
    return {
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer,
      lastUpdated: Date.now()
    };
  }

  // Konvertierung: Firebase-Daten zu Game-Objekt
  private firebaseToGame(data: any): Game {
    const game = new Game();
    game.players = data.players || [];
    game.stack = data.stack || [];
    game.playedCards = data.playedCards || [];
    game.currentPlayer = data.currentPlayer || 0;
    return game;
  }

  ngOnDestroy(): void {
    this.stopSync();
  }
}