import {Image} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {SvgOrImageProps} from '../shared/types';
import React from 'react';

const SvgOrImage = ({item, style}: SvgOrImageProps) => {
  const extension = item.url.slice(-3);
  if (extension === 'svg') {
    return <SvgUri uri={item.url} style={style} />;
  } else {
    return <Image source={{uri: item.url}} style={style} />;
  }
};

export default React.memo(SvgOrImage);
