// Importing React, useState, and useEffect to manage state and handle side effects in the component
import React, { useState, useEffect } from 'react';
// Importing components from React Native for layout, touch interactions, and modal behavior
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from 'react-native';

// Defining an array of color choices for the game
const colors = ['Red', 'Green', 'Blue', 'Yellow'];

// Main function component for the Simon Says game
export default function App() {
  // State to hold the current sequence of colors for Simon
  const [sequence, setSequence] = useState([]);
  // State to track the player's input sequence
  const [playerSequence, setPlayerSequence] = useState([]);
  // State to track whose turn it is: 'Simon' or 'Player'
  const [turn, setTurn] = useState('Simon');
  // State to control the visibility of the modal (popup)
  const [modalVisible, setModalVisible] = useState(false);
  // State to hold the message displayed in the modal
  const [modalMessage, setModalMessage] = useState('');

  // useEffect to trigger Simon's turn and generate the sequence when it's Simon's turn
  useEffect(() => {
    if (turn === 'Simon') {
      generateSequence();
    }
  }, [turn]); // Dependency array: runs when 'turn' changes

  // Function to generate a random color and add it to the sequence
  const generateSequence = () => {
    const newColor = colors[Math.floor(Math.random() * 4)]; // Randomly pick a color
    setSequence([...sequence, newColor]); // Append new color to the sequence
    playSequence([...sequence, newColor]); // Play the updated sequence for the player
  };

  // Function to play Simon's sequence to the player, one color at a time
  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before showing the next color
      setModalMessage(`Simon says: ${seq[i]}`); // Display the current color in the modal
      setModalVisible(true); // Show the modal with the color
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait to allow the player to see the color
      setModalVisible(false); // Hide the modal
    }
    setTurn('Player'); // After playing the sequence, give the turn to the player
  };

  // Function to handle player's input when they press a color button
  const handlePlayerInput = (color) => {
    setPlayerSequence([...playerSequence, color]); // Add the chosen color to player's sequence

    // Check if the player's input matches Simon's sequence so far
    if (sequence[playerSequence.length] === color) {
      // If the player's sequence is complete and correct, start a new round
      if (playerSequence.length + 1 === sequence.length) {
        setPlayerSequence([]); // Reset the player's sequence for the next round
        setTurn('Simon'); // Give the turn back to Simon
      }
    } else {
      // If the player's input is incorrect, show Game Over
      setModalMessage('Game Over! You missed the sequence.');
      setModalVisible(true); // Show the Game Over message
      setSequence([]); // Reset Simon's sequence
      setPlayerSequence([]); // Reset player's sequence
      setTurn('Simon'); // Restart the game with Simon's turn
    }
  };

  return (
    <View style={styles.container}>
      {/* Game title */}
      <Text style={styles.title}>Simon Says Game</Text>
      
      {/* Container for the four color buttons */}
      <View style={styles.buttonContainer}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: color.toLowerCase() }]} // Set button background color
            onPress={() => handlePlayerInput(color)} // Handle player input when button is pressed
          />
        ))}
      </View>

      {/* Custom Modal to display messages to the player */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible} // Control the visibility of the modal
        onRequestClose={() => setModalVisible(false)} // Allow modal to be closed manually
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text> 
            {/* Display message in the modal */}
            <Pressable
              style={[styles.buttonClose]} 
              onPress={() => setModalVisible(false)} // Close modal when "OK" is pressed
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', 
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 8, 
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  },
  modalView: {
    width: 300,
    backgroundColor: '#1e1e1e',
    borderRadius: 8, 
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 20,
  },
  buttonClose: {
    backgroundColor: '#e63946',
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
