import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Color from '../res/Color';

const { height, width } = Dimensions.get('screen');

const HEIGHT = 36;
const WIDTH = 200;

const ACTIONS = [
  { title: 'Move x 100', action: 'moveXY', x: 100, y: 0, duration: 1000 },
  { title: 'Rotate 90 deg', action: 'rotate', radians: 0.5, duration: 500 },
  {
    title: 'Move at x 100 y 100',
    action: 'moveXY',
    x: 100,
    y: 100,
    duration: 1000,
  },
  { title: 'Rotate 90 deg', action: 'rotate', radians: 0.75, duration: 500 },
  {
    title: 'Move at x -100 y 100',
    action: 'moveXY',
    x: 0,
    y: 100,
    duration: 1000,
  },
  { title: 'Rotate 90 deg', action: 'rotate', radians: 1, duration: 500 },
  { title: 'Move at x 0 y 0', action: 'moveXY', x: 0, y: 0, duration: 1000 },
];

const App = ({onBackPress}) => {
  const [dataDrag, setDataDrag] = useState(ACTIONS);
  const pan = useState(dataDrag.map(() => new Animated.ValueXY()))[0];

  const coords = useRef({ x: -1, y: -1 });

  const opacityAnimation = useState(
    dataDrag.map(() => new Animated.Value(0.8)),
  )[0];
  const [actionList, setActionList] = useState([]);

  const handleLayout = useCallback((event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    coords.current = {
      x: Math.round(x),
      y: Math.round(y),
      height: height,
      width: width,
    };
  }, []);

  const panResponder = (index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        pan[index].setValue({ x: 0, y: 0 });
        Animated.timing(opacityAnimation[index], {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: pan[index].x, dy: pan[index].y },
      ]),
      onPanResponderRelease: (e, gesture) => {
        if (isDropZone(gesture)) {
          pushItemInList(index);
          Animated.parallel([
            Animated.timing(opacityAnimation[index], {
              toValue: 0,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
            Animated.timing(pan[index], {
              toValue: { x: 250, y: 300 },
              duration: 2000,
            }),

            Animated.timing(pan[index], {
              toValue: { x: 0, y: 0 },
              duration: 0,
              useNativeDriver: false,
            }),
            Animated.timing(opacityAnimation[index], {
              toValue: 1,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
          ]).start();
        } else {
          pan[index].extractOffset();
        }
      },
    });

  const pushItemInList = (index) => {
    let tempArr = [...actionList];
    tempArr.push(dataDrag[index]);
    setActionList(tempArr);
  };

  const isDropZone = (gesture) => {
    const { moveY, moveX } = gesture;
    return (
      moveY > coords.current.y &&
      moveX > coords.current.x &&
      moveY < coords.current.y + coords.current.height &&
      moveX < coords.current.x + coords.current.width
    );
  };

  const backOnPress = ()=>{
    onBackPress(actionList)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
      onPress={backOnPress}
      style={styles.backContainer}>
        <Text style={styles.backTextStyle}>{'< Back'}</Text>
      </TouchableOpacity>
      <View style={styles.mainContainer}>
        <View onLayout={handleLayout} style={styles.dropZone}>
          <Text style={styles.text}>Drop Action Here</Text>
          <FlatList
            data={actionList}
            style={{ flexGrow: 1 }}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.listItem}>
                  <Text style={styles.text}>{item.title}</Text>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.directionContainer}>
          <FlatList
            style={{ position: 'absolute' }}
            data={dataDrag}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {}}>
                <View style={[styles.circle, {}]}>
                  <Text style={styles.text}>{item?.title ?? 'data'}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          {dataDrag.map((ele, index) => (
            <Animated.View
              {...panResponder(index).panHandlers}
              style={[
                styles.circle,
                pan[index].getLayout(),
                { opacity: opacityAnimation[index] },
              ]}
            >
              <Text style={styles.text}>{ele.title}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backTextStyle: {},
  backContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 70,
    width: Dimensions.get('screen').width,
    // backgroundColor:"red",
  },
  directionContainer: {
    flex: 0.5,
  },
  dropZone: {
    flex: 0.5,
    paddingTop:10,
    backgroundColor: Color.DropArea,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    color: '#fff',
  },
  circle: {
    width: WIDTH - 10,
    height: HEIGHT * 2,
    borderRadius: 20,
    backgroundColor: Color.ActionColor,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  listItem: {
    width: WIDTH - 80,
    height: HEIGHT * 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 20,

    backgroundColor: Color.ActionColor,
  },
});

export default App;
