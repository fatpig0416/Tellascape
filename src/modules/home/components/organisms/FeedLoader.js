import React, { Component } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { colors } = theme;
const speed = 0.8;

class FeedLoader extends Component {
  FlatListItemSeparator = () => {
    return <View style={{ height: 10 }} />;
  };

  render() {
    let avtarBGcolor = 'rgb(211,211,211)';
    let avtarFGcolor = 'rgb(211,211,211)';

    return (
      <SafeAreaView>
        <View style={{ height: 10 }} />
        <ContentLoader
          height={hp('30%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('30%')}`}
        >
          <Rect x={wp('0%')} y="5" rx="4" ry="4" width={wp('100%')} height={hp('30%')} />
        </ContentLoader>

        <ContentLoader
          height={hp('5%')}
          speed={speed}
          foregroundColor={colors.shimmerfgColor}
          backgroundColor={colors.shimmerbgColor}
          viewBox={`0 0 ${wp('100%')} ${hp('5%')}`}
        >
          <Rect x={wp('3%')} y={hp('2.2%')} rx={hp('0.3%')} width={wp('40%')} height={hp('0.6%')} />
          <Rect x={wp('87%')} y={hp('2.2%')} rx={hp('0.3%')} width={wp('10%')} height={hp('0.6%')} />
        </ContentLoader>

        <FlatList
          data={['1', '2']}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            return (
              <View style={{ top: index === 0 ? 0 : -hp('10%') }}>
                <ContentLoader
                  height={hp('40%')}
                  speed={speed}
                  backgroundColor={colors.shimmerbgColor}
                  foregroundColor={colors.shimmerfgColor}
                  viewBox={`0 0 ${wp('100%')} ${hp('40%')}`}
                >
                  <Rect x={wp('3%')} y="0" rx={wp('3%')} width={wp('94%')} height={hp('40%')} />
                </ContentLoader>

                <View style={{ top: -hp('42%') }}>
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
              </View>
            );
          }}
          keyExtractor={(item, index) => item}
          ItemSeparatorComponent={this.FlatListItemSeparator}
        />
      </SafeAreaView>
    );
  }
}

export default FeedLoader;
