import React from 'react';
import { Text, View } from 'react-native';
import { getCharacterStage, CHARACTER_STAGE_EMOJI, CHARACTER_STAGE_LABEL } from '../utils/characterStages';

type Props = {
  progressRatio: number;
};

export function CharacterView({ progressRatio }: Props) {
  const stage = getCharacterStage(progressRatio);

  return (
    <View style={{ alignItems: 'center' }}>
      {/* プレースホルダー表示。本番では assets/character の画像に差し替える */}
      <Text style={{ fontSize: 44 }}>{CHARACTER_STAGE_EMOJI[stage]}</Text>
      <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
        {CHARACTER_STAGE_LABEL[stage]}
      </Text>
    </View>
  );
}
