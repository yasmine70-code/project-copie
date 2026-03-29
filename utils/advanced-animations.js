import { Animated, Easing } from 'react-native';

// Animations avancées pour l'application
export const AdvancedAnimations = {
  // Animation de pulse futuriste
  createPulse: (value, toValue = 1.2, duration = 1000) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue,
          duration,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Animation de shimmer futuriste
  createShimmer: (value, duration = 2000) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Animation de vague holographique
  createWave: (value, duration = 3000) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 3,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.5,
          duration: duration / 3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 3,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Animation de rotation 3D
  createRotation3D: (valueX, valueY, duration = 4000) => {
    return Animated.loop(
      Animated.parallel([
        Animated.timing(valueX, {
          toValue: 360,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(valueY, {
          toValue: 360,
          duration: duration * 1.5,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Animation de glitch futuriste
  createGlitch: (value, duration = 100) => {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1.1,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: duration / 4,
        useNativeDriver: true,
      }),
    ]);
  },

  // Animation de morphing
  createMorphing: (value, values, duration = 2000) => {
    const animations = values.map((val, index) => 
      Animated.timing(value, {
        toValue: val,
        duration: duration / values.length,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      })
    );

    return Animated.loop(Animated.sequence(animations));
  },

  // Animation de particules
  createParticles: (particles, duration = 3000) => {
    return particles.map((particle, index) => {
      const delay = index * 100;
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: duration - 500,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0.5,
            duration: duration - 500,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });
  },

  // Animation de néon
  createNeon: (value, duration = 1500) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 3,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.3,
          duration: duration / 3,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 3,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Animation de hologramme
  createHologram: (value, duration = 4000) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 0.8,
          duration: duration / 4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.9,
          duration: duration / 4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Animation de chargement futuriste
  createLoading: (value, duration = 2000) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 4,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.3,
          duration: duration / 4,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.8,
          duration: duration / 4,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.5,
          duration: duration / 4,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
  },
};

// Valeurs animées initiales
export const createAnimatedValues = () => ({
  pulse: new Animated.Value(1),
  shimmer: new Animated.Value(0),
  wave: new Animated.Value(0.5),
  rotationX: new Animated.Value(0),
  rotationY: new Animated.Value(0),
  glitch: new Animated.Value(1),
  morphing: new Animated.Value(0),
  neon: new Animated.Value(1),
  hologram: new Animated.Value(1),
  loading: new Animated.Value(0.5),
});

// Particules pour animations
export const createParticles = (count = 20) => {
  return Array.from({ length: count }, (_, index) => ({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    delay: index * 100,
  }));
};
