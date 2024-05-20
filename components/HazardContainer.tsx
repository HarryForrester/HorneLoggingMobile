import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';

function HazardContainer({hazards}: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Function to set the color based on severity
  const setColorBasedOnSeverity = (sev: string) => {
    if (sev === 'HIGH') return '#ff6361';
    if (sev === 'MEDIUM') return '#ffa600';
    return '#aecdc2';
  };

  return (
    <View style={isDarkMode ? styles.darkBackground : styles.lightBackground}>
      {hazards.map((selectedHazard: any, index: number) => {
        // Set the color based on severity
        const hazardColor = setColorBasedOnSeverity(selectedHazard.sev);

        return (
          <View key={index} style={[styles.card, {shadowColor: hazardColor}]}>
            <View style={[styles.cardHeader, {backgroundColor: hazardColor}]}>
              <View style={styles.leftContent}>
                <Text style={styles.title}>
                  {selectedHazard.id}:{' '}
                  <Text style={styles.emphasis}>{selectedHazard.title}</Text>
                </Text>
                <Text style={styles.smallText}>({selectedHazard.sev})</Text>
              </View>
              <View style={styles.rightContent}>
                <Text style={styles.category}>{selectedHazard.cat}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.definitionList}>
                {Object.entries(selectedHazard.harms).map(
                  ([key, value]: any) => (
                    <View key={key} style={styles.listItem}>
                      <Text
                        style={[
                          styles.term,
                          {color: isDarkMode ? 'white' : '#241c23'},
                        ]}>
                        {key}
                      </Text>
                      <View style={styles.itemContainer}>
                        {value.map((item: string, itemIndex: number) => (
                          <Text
                            key={itemIndex}
                            style={[
                              styles.item,
                              {color: isDarkMode ? 'white' : '#241c23'},
                            ]}>
                            {item}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ),
                )}
              </View>
              <View style={styles.reviewInfo}>
                <Text
                  style={[
                    styles.reviewText,
                    {color: isDarkMode ? 'white' : '#241c23'},
                  ]}>
                  Reviewed: {selectedHazard.reviewDate} (
                  {selectedHazard.reviewReason})
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  darkBackground: {
    backgroundColor: '#1d1d1d',
  },
  lightBackground: {
    backgroundColor: '#e7f0ed',
    borderRadius: 5,
  },
  card: {
    marginBottom: 10,
    borderRadius: 5,
    //shadowColor: '408c6c',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  leftContent: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: '#241c23',
  },
  emphasis: {
    fontStyle: 'italic',
  },
  smallText: {
    fontSize: 12,
    color: '#241c23',
  },
  rightContent: {},
  category: {
    fontWeight: 'bold',
    color: '#241c23',
  },
  cardBody: {
    padding: 15,
  },
  definitionList: {
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  term: {
    width: 120,
    paddingRight: 10,
  },
  itemContainer: {
    flex: 1,
  },
  item: {},
  reviewInfo: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: -10,
    alignSelf: 'flex-end',
  },
  reviewText: {
    fontStyle: 'italic',
  },
});

export default HazardContainer;
