import React, { Component } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { colors } = theme;

class ProfileLoader extends Component {
  render() {
    let speed = 0.8;
    let avatarWidth = hp('10%');
    let avtarBGcolor = 'rgb(211,211,211)';
    let avtarFGcolor = 'rgb(211,211,211)';
    return (
      <SafeAreaView>
        <View style={{ height: 10 }} />

        <ContentLoader
          height={hp('6%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('6%')}`}
        >
          <Rect x={wp('40%')} y="5" rx="4" ry="4" width={wp('20%')} height="8" />
          <Rect x={wp('25%')} y="28" rx="4" ry="4" width={wp('50%')} height="8" />
        </ContentLoader>

        <ContentLoader
          height={hp('30%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('30%')}`}
        >
          <Rect x={wp('0%')} y="0" rx="4" ry="4" width={wp('100%')} height={hp('30%')} />
        </ContentLoader>

        <View style={{ top: -hp('5%') }}>
          <ContentLoader
            height={hp('10%')}
            speed={speed}
            foregroundColor={avtarBGcolor}
            backgroundColor={avtarFGcolor}
            viewBox={`0 0 ${wp('100%')} ${hp('10%')}`}
          >
            <Rect
              x={wp('50%') - avatarWidth / 2}
              y="0"
              rx={hp('5%')}
              ry={hp('5%')}
              width={avatarWidth}
              height={avatarWidth}
            />
          </ContentLoader>
        </View>
        <View style={{ top: -hp('8%') }}>
          <ContentLoader
            height={hp('10%')}
            speed={speed}
            foregroundColor={colors.shimmerfgColor}
            backgroundColor={colors.shimmerbgColor}
            viewBox={`0 0 ${wp('100%')} ${hp('10%')}`}
          >
            <Rect x={wp('5%')} y={'0'} rx={hp('2%')} width={wp('25%')} height={hp('4%')} />
            <Rect x={wp('70%')} y={'0'} rx={hp('2%')} width={wp('25%')} height={hp('4%')} />

            <Rect x={wp('15%')} y={'50'} rx={hp('0.4%')} width={wp('20%')} height={hp('0.8%')} />
            <Rect x={wp('40%')} y={'50'} rx={hp('0.4%')} width={wp('20%')} height={hp('0.8%')} />
            <Rect x={wp('65%')} y={'50'} rx={hp('0.4%')} width={wp('20%')} height={hp('0.8%')} />

            <Rect x={wp('40%')} y={'70'} rx={hp('0.4%')} width={wp('20%')} height={hp('0.8%')} />
          </ContentLoader>
        </View>

        <View style={{ top: -hp('8%') }}>
          <ContentLoader
            height={hp('4%')}
            speed={speed}
            foregroundColor={colors.shimmerfgColor}
            backgroundColor={colors.shimmerbgColor}
            viewBox={`0 0 ${wp('100%')} ${hp('4%')}`}
          >
            <Rect x={wp('0%')} y={'0'} width={wp('100%')} height={hp('0.1%')} />
            <Rect x={wp('35%')} y={'15'} rx={hp('0.25%')} width={wp('30%')} height={hp('0.5%')} />
            <Rect x={wp('0%')} y={hp('0.5%') + 30} width={wp('100%')} height={hp('0.1%')} />
          </ContentLoader>
        </View>

        <View style={{ top: -hp('8%') }}>
          <ContentLoader
            height={hp('60%')}
            speed={speed}
            foregroundColor={colors.shimmerfgColor}
            backgroundColor={colors.shimmerbgColor}
            viewBox={`0 0 ${wp('100%')} ${hp('60%')}`}
          >
            <Rect x={wp('2.5%')} y={'20'} rx={'8'} width={wp('95%')} height={hp('70%')} />
          </ContentLoader>
        </View>

        <View style={{ top: -hp('68%') }}>
          <ContentLoader
            height={hp('10%')}
            speed={speed}
            foregroundColor={avtarBGcolor}
            backgroundColor={avtarFGcolor}
            viewBox={`0 0 ${wp('100%')} ${hp('10%')}`}
          >
            <Rect x={wp('4.5%')} y={hp('3%')} rx={hp('3%')} width={hp('6%')} height={hp('6%')} />

            <Rect x={wp('20%')} y={hp('4.3%')} rx={hp('0.4%')} width={wp('30%')} height={hp('0.8%')} />
            <Rect x={wp('20%')} y={hp('6.3%')} rx={hp('0.4%')} width={wp('15%')} height={hp('0.8%')} />
            <Rect x={wp('85%')} y={hp('5%')} rx={hp('0.25%')} width={wp('8%')} height={hp('0.5%')} />
          </ContentLoader>
        </View>
      </SafeAreaView>
    );
  }
}

export default ProfileLoader;
