import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";

const FeedbackList = ({ feedbacks }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <IconButton
            key={star}
            icon="star"
            size={16}
            color={star <= rating ? "gold" : "#E0E0E0"}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {feedbacks.map((feedback, index) => (
        <Card key={index} style={styles.feedbackCard}>
          <Card.Content>
            <View style={styles.feedbackHeader}>
              <View>
                <Title style={styles.author}>{feedback.author}</Title>
                <Paragraph style={styles.date}>
                  {formatDate(feedback.date)}
                </Paragraph>
              </View>
              {renderStars(feedback.rating)}
            </View>
            <Paragraph style={styles.comment}>{feedback.comment}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  feedbackCard: {
    marginBottom: 8,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  starsContainer: {
    flexDirection: "row",
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FeedbackList;
