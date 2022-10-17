import React, {FC, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Linking,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {useNavigation} from '@react-navigation/native';
import {GrayScaleColors, PaletteColors} from '../../styles/colors';
import StyledButton from '../common/styled-button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  componentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    paddingVertical: 32,
    fontSize: 28,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
  },
});

const LoginScreen: FC = () => {
  const [loading, setLoading] = useState(false);
  const [authEnabled, setAuthEnabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkAuthConfig();
  }, []);

  const checkAuthConfig = async () => {
    try {
      setLoading(true);
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setAuthEnabled(enrolled);
      if (!enrolled) {
        console.log('not enrolled');
        return;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      setLoading(true);
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage:
          'Grant access to authentication for visualizing the TODO list',
      });

      if (authResult.success) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (err) {
      console.log(err);
      setAuthEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const goToSettings = async () => {
    try {
      Linking.openSettings();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GrayScaleColors.BACKGROUND}}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.componentContainer}>
          <Text style={styles.title}>Secured TODO List</Text>
        </View>
        <ImageBackground
          style={styles.imageContainer}
          resizeMode="center"
          source={require('../../../assets/icon.png')}
        />
        <View style={styles.componentContainer}>
          {loading ? (
            <ActivityIndicator
              animating={true}
              color={PaletteColors.PRIMARY}
              size="large"
            />
          ) : authEnabled ? (
            <StyledButton
              title={'Authenticate'}
              onPress={() => authenticate()}
            />
          ) : (
            <>
              <Text style={{marginBottom: 8}}>
                Set Authentication to proceed
              </Text>
              <StyledButton
                title={'Go to settings'}
                onPress={() => goToSettings()}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
