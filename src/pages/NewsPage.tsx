import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import FetchApiNews from './../utils/API/FetchApiNews';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

// Define the type for news data
interface NewsItem {
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

const NewsPage = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await FetchApiNews();
        setNewsData(data.news); 
        setLoading(false);
      } catch (error) {
        setError('Error fetching news');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        keyExtractor={(item, index) => item.url}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>By {item.author}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.publishedAt}>Published at: {new Date(item.publishedAt).toLocaleDateString()}</Text>
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsItem: {
    marginBottom: 16,
    padding: 16,
    top : 10,
    borderRadius: 20,
    backgroundColor: Colors.Pale_Teal,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily : fonts.PoppinsSemiBold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.Dark_Teal,
  },
  author: {
    fontSize: 14,
    fontFamily : fonts.PoppinsSemiBold,
    marginBottom: 8,
    color: Colors.Dark_Teal,
  },
  description: {
    fontFamily : fonts.PoppinsSemiBold,
    fontSize: 14,
    color: Colors.Dark_Teal,
    marginBottom: 8,
  },
  publishedAt: {
    fontFamily : fonts.PoppinsSemiBold,
    fontSize: 12,
    color: Colors.Teal,
  },
});

export default NewsPage;
