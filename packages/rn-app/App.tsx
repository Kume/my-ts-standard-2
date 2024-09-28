/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {sumNumbers} from '@my-ts-standard/common';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.view}>
        <Text>SUM = {sumNumbers([1, 2, 3])}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 1,
  },
});

export default App;
