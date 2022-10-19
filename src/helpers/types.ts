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
  value: number;
  location: "upper" | "lower";
  calculated?: boolean;
}

export interface Die {
  id: number;
  fixed: boolean;
  currentValue: number;
}

export type DieCount = {
  value: number;
  count: number;
};
