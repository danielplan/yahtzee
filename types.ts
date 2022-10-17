export type Color = {
  code: string;
  label: string;
};

export interface Game {
  players: Player[];
}

export interface Player {
  color: Color;
  score: ScoreElement[];
}

export interface ScoreElement {
  label: string;
  priority: number;
  value: number;
}

export interface Die {
  id: number;
  fixed: boolean;
  currentValue: number;
}
