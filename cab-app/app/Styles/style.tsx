import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  list: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 20,
    margin: 3,
    overflow: "scroll",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 20,
    backgroundColor: "white",
    marginTop: 30,
  },
  button:{position: 'absolute',
    bottom:0,
    zIndex:100,
    width:'100%', 
  },
  locationText:{
    
  }
});

export default styles;
