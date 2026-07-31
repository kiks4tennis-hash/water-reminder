import { CharacterStage } from '../types';

/**
 * 達成率(0〜1以上)からキャラクターの成長段階を判定する。
 * ネガティブな演出(しおれる等)は入れず、未達成時は "seed" のまま据え置く方針。
 */
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

// 現状はプレースホルダーとして絵文字を使用。
// 本番では assets/character 配下のSVG/PNGに差し替える(sharpでPNG化する運用を流用)。
export const CHARACTER_STAGE_EMOJI: Record<CharacterStage, string> = {
  seed: '🌰',
  sprout: '🌱',
  leaf: '🌿',
  bloom: '🌸',
};
