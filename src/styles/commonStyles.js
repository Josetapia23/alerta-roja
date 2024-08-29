import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '40%',
    zIndex: -1,
  },
  bottomEllipse: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    left: -92,
    top: '80%',
    backgroundColor: '#FA5353',
    borderRadius: 160,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userNameText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  panicButton: {
    borderRadius: '50%',
    marginTop: 150,
    alignItems: 'center',
  },
  panicIcon: {
    width: 295,
    height: 300,
  },
  emergencyContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  emergencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AE2525',
  },
  emergencyButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  emergencyButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  emergencyIcon: {
    width: 100,
    height: 100,
  },
});
