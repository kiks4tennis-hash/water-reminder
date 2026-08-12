import { CharacterStage } from '../types';

export function getCharacterStage(progressRatio: number): CharacterStage {
  if (progressRatio >= 1) return 'bloom';
  if (progressRatio >= 0.66) return 'leaf';
  if (progressRatio >= 0.33) return 'sprout';
  return 'seed';
}

export const CHARACTER_STAGE_LABEL: Record<CharacterStage, string> = {
  seed: 'たね',
  sprout: 'めばえ',
  leaf: 'わかば',
  bloom: 'かいか',
};

export const CHARACTER_STAGE_EMOJI: Record<CharacterStage, string> = {
  seed: '🌰',
  sprout: '🌱',
  leaf: '🌿',
  bloom: '🌸',
};
