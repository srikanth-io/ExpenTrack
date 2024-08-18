import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import fetchCurrencyNews from '../utils/API/FetchApiNews';


const NewsPage = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const getNews = async () => {
        try {
          const data = await fetchCurrencyNews('USD', 'EUR', 'en');
          setNewsData(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching news:', error);
          setError('Failed to load news');
          setLoading(false);
        }
      };
  
      getNews();
    }, []);
  
    if (loading) {
      return (
        <View style={styles.centered}>
          <Text>Loading...</Text>
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.centered}>
          <Text>{error}</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <FlatList
          data={newsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsItem}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    newsItem: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: '#666',
    },
  });
  
  export default NewsPage;
  