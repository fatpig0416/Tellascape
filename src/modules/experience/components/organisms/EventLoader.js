import React, { Component } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { colors } = theme;

class EventLoader extends Component {
  render() {
    let optionWidth = hp('4.5');
    let speed = 0.8;
    return (
      <SafeAreaView>
        <View style={{ height: 10 }} />
        <ContentLoader
          height={hp('6%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('6%')}`}
          style={styles.orderItemContainer}
        >
          <Rect x={wp('3%')} y="0" rx={hp('2.5%')} ry={hp('2.5%')} width={hp('5%')} height={hp('5%')} />
          <Rect x={wp('20%')} y="5" rx="4" ry="4" width={wp('20%')} height="8" />
          <Rect x={wp('20%')} y="28" rx="4" ry="4" width={wp('50%')} height="8" />
        </ContentLoader>

        <ContentLoader
          height={hp('1%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('1%')}`}
          style={{ alignItems: 'center' }}
        >
          <Rect x={'0'} y="0" width={wp('100%')} height="0.5" />
        </ContentLoader>

        <ContentLoader
          height={hp('6%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('6%')}`}
          style={{ alignItems: 'center' }}
        >
          <Rect x={wp('3%')} y="5" rx={hp('2.5%')} width={hp('4.5%')} height={hp('4.5%')} />
          <Rect x={wp('50%') - optionWidth / 2} y="5" rx={hp('2.5%')} width={hp('4.5%')} height={hp('4.5%')} />
          <Rect x={wp('100%') - optionWidth - wp('3%')} y="5" rx={hp('2.5%')} width={hp('4.5%')} height={hp('4.5%')} />
        </ContentLoader>

        <ContentLoader
          height={hp('2%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('2%')}`}
          style={{ alignItems: 'center' }}
        >
          <Rect x={'0'} y="10" width={wp('100%')} height="0.9" />
        </ContentLoader>

        <ContentLoader
          height={hp('2%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('2%')}`}
          style={{ alignItems: 'center' }}
        >
          <Rect x={wp('40%')} y="8" rx="2" ry="2" width={wp('20%')} height="3" />
        </ContentLoader>

        <ContentLoader
          height={hp('50%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('50%')}`}
          style={{ alignItems: 'center' }}
        >
          <Rect x={'0'} y="5" rx="2" ry="2" width={wp('100%')} height={hp('50%')} />
        </ContentLoader>
        <View style={{ height: 5 }} />

        <ContentLoader
          height={hp('6%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('6%')}`}
          style={{ alignItems: 'center' }}
        >
          <Rect x={wp('2%')} y="10" rx="2" ry="2" width={wp('50%')} height={'4'} />
          <Rect x={wp('90%')} y="10" rx="2" ry="2" width={wp('8%')} height={'4'} />

          <Rect x={wp('2%')} y="20" rx="10" ry="10" width={'18'} height={'18'} />
          <Rect x={wp('2%') + 24} y="26" rx="2" ry="2" width={'20'} height={'4'} />
          <Rect x={wp('20%')} y="20" rx="10" ry="10" width={'18'} height={'18'} />
          <Rect x={wp('20%') + 24} y="26" rx="2" ry="2" width={'20'} height={'4'} />
          <Rect x={wp('40%')} y="20" rx="10" ry="10" width={'18'} height={'18'} />
          <Rect x={wp('40%') + 24} y="26" rx="2" ry="2" width={'20'} height={'4'} />
        </ContentLoader>
        <View style={{ height: 10 }} />
        <ContentLoader
          height={hp('5%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('5%')}`}
          style={{ alignItems: 'center' }}
        >
          <Rect x={wp('2%')} y="0" rx={hp('2.5%')} ry={hp('2.5%')} width={wp('96%')} height={hp('5%')} />
        </ContentLoader>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

export default EventLoader;
