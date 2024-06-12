import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUser } from '@realm/react';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [accessLevelAdmin, setAccessLevelAdmin] = useState<null | string>(null);
  const [accessLevelForeman, setAccessLevelForeman] = useState<null | string>(null);

  const user = useUser();
  const href = accessLevelAdmin === 'on' || accessLevelForeman === 'on' ? undefined : null;

  useEffect(() => {
    console.log('devieeeeeee', user.customData.device);
    if (user.customData.device === JSON.stringify({ accessLevelAdmin: 'on' })) {
      setAccessLevelAdmin('on');
      setAccessLevelForeman('off');
    } else if (user.customData.device === JSON.stringify({ accessLevelForeman: 'on' })) {
      setAccessLevelForeman('on');
      setAccessLevelAdmin('off');
    } else {
      setAccessLevelForeman('off');
      setAccessLevelAdmin('off');
    }
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="docs"
        options={{
          href: null,
          title: 'Docs',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'documents' : 'documents-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forms"
        options={{
          title: 'Forms',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'documents' : 'documents-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          href: null,
          title: 'People',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
