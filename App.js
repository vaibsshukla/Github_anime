import React, { act, useRef, useState } from 'react';
import {
  View,
  Animated,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import Assets from './src/res/assets/common/index';
import AddAction from './src/components/AddAction';

const AnimatedBox = () => {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const [addActionEnable, setAddActionEnable] = useState(false);
  const [actions, setActions] = useState([]);

  const animations = [];

  // Function to add a translation animation
  const addTranslation = (x, y, duration) => {
    const translation = Animated.timing(position, {
      toValue: { x, y },
      duration: duration,
      useNativeDriver: true,
    });
    animations.push(translation);
  };

  // Function to add a rotation animation
  const addRotation = (toValue, duration) => {
    const rotateAnimation = Animated.timing(rotation, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: true,
    });
    animations.push(rotateAnimation);
  };

  // Example: adding translation and rotation animations dynamically
  // addTranslation(100, 0, 1000); // Move right
  // addRotation(0.5, 500);          // Rotate 180 degrees (0.5 in radians)
  // addTranslation(100, 100, 1000); // Move down
  // addRotation(0.75, 500);            // Rotate back to 360 degrees (1 in radians)
  // addTranslation(0, 100, 1000); // Move left
  // addRotation(1, 500);            // Rotate 540 degrees (1.5 in radians)
  // addTranslation(0, 0, 1000);   // Move up
  // addRotation(4, 500);            // Rotate back to 720 degrees (2 in radians)

  const startAnimation = () => {
    // addTranslation(100, 0, 1000); // Move right
    // addRotation(0.5, 500);          // Rotate 180 degrees (0.5 in radians)
    // addTranslation(100, 100, 1000);
    let lst = [...actions];

    lst.forEach((element) => {
      if (element.action == 'moveXY') {
        console.log('elementelement' + JSON.stringify(element));
        console.log('elementelement' + element.x);
        console.log('elementelement' + element.y);

        addTranslation(element.x, element.y, element.duration);
      } else {
        addRotation(element.radians, element.duration);
      }
    });
    Animated.sequence(animations).start();
  };

  // Interpolating the rotation value to degrees
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 2], // 0 to 2 (where 1 is 360 degrees)
    outputRange: ['0deg', '720deg'], // Rotate from 0 to 720 degrees
  });


  const actionButtonPress = ()=>{
    setAddActionEnable(true)
  }

  return (
    <View style={styles.container}>
       {!addActionEnable &&<View style={styles.container}>
     <Animated.View
        style={[
          {
            transform: [
              ...position.getTranslateTransform(), // Apply the translation
              { rotate: rotateInterpolate }, // Apply the rotation
            ],
          },
        ]}
      >
        <Image source={Assets.common.cape} />
      </Animated.View>
      <TouchableOpacity onPress={startAnimation} style={styles.playContainer}>
        <Text>Play Animation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={actionButtonPress} style={styles.actionContainer}>
        <Text>Add Action</Text>
      </TouchableOpacity>
      </View>}
      {/* <Button title="Start Animation" onPress={startAnimation} /> */}

      {addActionEnable && (
        <AddAction
          onBackPress={(actionList) => {
            setAddActionEnable(false);
            setActions(actionList);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 100,
    height: 100,
  },
  playContainer  : {
    position:"absolute",
    bottom:120,
    borderWidth:0.8,
    padding:10,
    borderRadius:10
    

  },
  actionContainer  : {
    position:"absolute",
    bottom:20,
    borderWidth:0.8,
    padding:10,
    borderRadius:10
  }
});

export default AnimatedBox;
