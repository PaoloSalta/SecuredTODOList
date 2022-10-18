import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GrayScaleColors, PaletteColors} from '../../styles/colors';

interface IProps {
  onPress: () => void;
  title: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PaletteColors.PRIMARY,
    padding: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: GrayScaleColors.WHITE,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

const StyledButton: FC<IProps> = ({onPress, title}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default StyledButton;
