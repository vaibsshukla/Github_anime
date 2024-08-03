import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity, Dimensions, Easing } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const {height,width} = Dimensions.get("screen")

const CIRCLE_RADIUS = 36;


const App = () => {
  const [dataDrag, setDataDrag] = useState([1, 2, 3, 4, 5]);
  const pan = useState(dataDrag.map(() => new Animated.ValueXY()))[0];
  // const pan2 = useState(dataDrag.map(() => new Animated.ValueXY()))[0];

  const coords = useRef({ x: -1, y: -1 });
  const coords1 = useRef({ x: -1, y: -1 });

  const opacityAnimation = useState(dataDrag.map(() => new Animated.Value(0.8)))[0];
  const [actionList, setActionList] = useState([]);

  const handleLayout = useCallback((event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    console.log("xxxxxxx"+x)
    console.log("yyyyyyy"+y)
    console.log("height"+height)
    console.log("width"+width)

    coords.current = {
      x: Math.round(x),
      y: Math.round(y),
      height: height,
      width: width,
    };
    coords1.current = {
      x: Math.round(x),
      y: Math.round(y),
      height: height,
      width: width,
    };
  }, []);

  // this.cardOpacity = this.opacityValue.interpolate({
  //   inputRange: [0, 1, 2],
  //   outputRange: [0, 0.5, 1]
  // });

  const panResponder = (index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
      //  pan[index].setOffset({x:pan[index].x,y:pan[index].y });
        pan[index].setValue({ x: 0, y: 0 });
        Animated.timing(opacityAnimation[index], {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: false
        }).start()
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: pan[index].x, dy: pan[index].y },
      ]),
      onPanResponderRelease: (e, gesture) => {
        
        if (isDropZone(gesture)) {
          console.log('Dropped in drop zone');
         
          // pan[index].extractOffset();
          pushItemInList(index)
          Animated.parallel([
            // Animated.timing(opacityAnimation[index], {
            //   toValue: 0.0,
            //   duration: 0,
            //   useNativeDriver: false
            // }),
            // pan[index].setValue({ x: 0, y: 0 }),
            // Animated.timing(opacityAnimation[index], {
            //   toValue: 0.8,
            //   duration: 1500,
            //   useNativeDriver: false
            // })
            Animated.timing(opacityAnimation[index], {
              toValue: 0,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: false
            }),
            
            
            Animated.timing(pan[index], {
              toValue: { x: 0, y: 0 },
              duration: 0,
              useNativeDriver: false
            }),
            Animated.timing(opacityAnimation[index], {
              toValue: 1,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: false
            }),
          ]).start()
          // Animated.event([
          //   null,
          //   { x: coords.current.x, y: coords.current.y },
          // ])
          // pan[index].setValue()
          // opacityAnimation[index].interpolate({
          //   inputRange: [0, 2],
          //   outputRange: [0, 1]}
          // )
        } else {
          console.log('NOOOOOOO   Dropped in drop zone');

          pan[index].extractOffset();
          // pan[index].flattenOffset()      

          // Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    });

    const pushItemInList = (index)=>{
      let tempArr = [...actionList];
      console.log('tempArrtempArr' + JSON.stringify(tempArr));
      tempArr.push(index);
      setActionList(tempArr);
    }

  const isDropZone = (gesture) => {
    // if (!coords) return false;
    const { moveY, moveX } = gesture;
    console.log('coords.ycoords.y' + coords.current.y);
    console.log('moveYmoveY' + JSON.stringify(gesture));
    console.log('coordscoords' + JSON.stringify(coords));

    return (
      moveY > coords.current.y &&
      moveX > coords.current.x &&
      moveY < coords.current.y + coords.current.height &&
      moveX < coords.current.x + coords.current.width
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View onLayout={handleLayout} style={styles.dropZone}>
        <Text style={styles.text}>Drop me here!</Text>
        <FlatList
          data={actionList}
          style={{ flexGrow: 1 }}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  height: 40,
                  width: 40,
                  margin: 10,
                  backgroundColor: 'red',
                }}
              ></View>
            );
          }}
        />
      </View>
      
      {dataDrag?.map((ele,index)=>
         <TouchableOpacity onPress={() => {}}>
          <View style={[styles.circle,{position:"absolute",marginTop:(CIRCLE_RADIUS*2)*index,}]}>
            <Text style={styles.text}>Drag me!</Text>
          </View>
         </TouchableOpacity>
      )}

      <View style={styles.directionContainer}>
        {dataDrag.map((ele, index) => (
          <Animated.View
          
            {...panResponder(index).panHandlers}
            style={[styles.circle, pan[index].getLayout(),{opacity:opacityAnimation[index]}]}
          >
            <Text style={styles.text}>Drag me!</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

    flexDirection: 'row',
  },
  directionContainer: {
    flex: 0.5,
  },
  dropZone: {
    flex: 0.5,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    color: '#fff',
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    backgroundColor: '#1abc9c',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

// import { StyleSheet, Text, View,Animated,PanResponder, } from 'react-native'
// import React,{useEffect, useRef, useState,useCallback} from 'react'

// const App = () => {

//   const pan = useRef(new Animated.ValueXY()).current;
//   const dropZoneLayout = useRef(new Animated.ValueXY()).current;
//   const [layout, setLayout] = useState(null);

//   // const [dimensions, setDimensions] = useState({width:0, height:0})

// console.log("sizesize"+JSON.stringify(dropZoneLayout))
//     const panResponder = useState(
//       PanResponder.create({
//         onMoveShouldSetPanResponder: () => true,
//         onPanResponderMove: (_,gesture)=>{

//           pan.x.setValue(gesture.dx)
//           pan.y.setValue(gesture.dy)
//         },
//         onPanResponderRelease: (_,gesture) => {
//           // if(isDropZone(gesture)){
//           //   console.log("IS DROP ZONE")
//           // }
//           console.log("RELEASE")
//           pan.extractOffset();
//         },
//       }),
//     )[0];

//     const isDropZone=(gesture)=>{
//       // if (!layout) return false;

//       console.log("sizesize22222"+layout)

//       console.log("gesture"+JSON.stringify(gesture))
//       // var dz = dropZoneValues;
//       // return gesture.dx

//     }
//     const handleLayout = (event) => {
//       const { x, y, width, height } = event.nativeEvent.layout;
//       setLayout({ x, y, width, height });
//     };

//     useEffect(() => {
//       if (layout) {
//         console.log('Layout:', layout);
//       }
//     }, [layout]);

//   return (
//     <View style={styles.container}>
//     <Animated.View
//    onLayout={handleLayout}
//     style={[styles.dropZone]}>

//     </Animated.View>
//       <Animated.View
//         style={{
//           transform: [{translateX: pan.x}, {translateY: pan.y}],
//         }}
//         {...panResponder.panHandlers}>
//         <View style={styles.box} />
//       </Animated.View>
//       {layout && (
//         <Text style={styles.info}>
//           X: {layout.x}, Y: {layout.y}, Width: {layout.width}, Height: {layout.height}
//         </Text>
//       )}
//     </View>
//   )
// }

// export default App

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   titleText: {
//     fontSize: 14,
//     lineHeight: 24,
//     fontWeight: 'bold',
//   },
//   box: {
//     height: 150,
//     width: 150,
//     backgroundColor: 'blue',
//     borderRadius: 5,
//   },
//   dropZone:{
//     height:200,
//     width:"100%",
//     backgroundColor:"red"
//   }

// })

