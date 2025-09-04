import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import AuthScreen from '@/screens/AuthScreen';
import HomeScreen from '@/screens/HomeScreen';
import TopicDetailScreen from '@/screens/TopicDetailScreen';
import SubjectPlaylistScreen from '@/screens/SubjectPlaylistScreen';
import BookmarksScreen from '@/screens/BookmarksScreen';
import DownloadsScreen from '@/screens/DownloadsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import AdminScreen from '@/screens/AdminScreen';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  TopicDetail: { topicId: string };
  SubjectPlaylist: { subjectName: string };
  Admin: undefined;
};

export type TabParamList = {
  Home: undefined;
  Bookmarks: undefined;
  Downloads: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Downloads') {
            iconName = focused ? 'download' : 'download-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#0F0F23',
          borderTopColor: '#1F1F37',
        },
        headerStyle: {
          backgroundColor: '#0F0F23',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Downloads" component={DownloadsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F0F23',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TopicDetail" 
            component={TopicDetailScreen}
            options={{ title: 'Topic Details' }}
          />
          <Stack.Screen 
            name="SubjectPlaylist" 
            component={SubjectPlaylistScreen}
            options={{ title: 'Subject Playlist' }}
          />
          <Stack.Screen 
            name="Admin" 
            component={AdminScreen}
            options={{ title: 'Admin Panel' }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};