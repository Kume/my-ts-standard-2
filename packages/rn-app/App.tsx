/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Button, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {db, migrator} from './src/common/Database';

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
        <Text>Test</Text>
        <Button
          title="Select"
          onPress={async () => {
            const result = await db.selectFrom('test').selectAll().execute();
            console.log(result);
          }}
        />
        <Button
          title="Insert"
          onPress={async () => {
            await db.insertInto('test').values({name: ''}).execute();
          }}
        />
        <Button
          title="Migration"
          onPress={async () => {
            await migrator.migrateToLatest();
          }}
        />
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
