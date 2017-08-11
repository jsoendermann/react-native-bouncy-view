import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import PropTypes from 'prop-types'

class BouncyView extends Component {
  static EASING = Easing.bezier(0.13, 0.69, 0.32, 1)

  static propTypes = {
    bounceDuration: PropTypes.number,
    bounceHeight: PropTypes.number,
  }

  static defaultProps = {
    bounceDuration: 2000,
    bounceHeight: 50,
  }

  state = {
    yOffset: new Animated.Value(0),
    childViewIndex: 0,
  }

  componentDidMount() {
    this.startNextAnimation()
  }

  startNextAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.yOffset, {
        toValue: 1,
        duration: this.props.bounceDuration / 2,
        easing: BouncyView.EASING,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.yOffset, {
        toValue: 0,
        duration: this.props.bounceDuration / 2,
        easing: Easing.out(BouncyView.EASING),
        useNativeDriver: true,
      }),
    ]).start(this.animationFinished)
  }

  animationFinished = () => {
    this.setState(
      {
        childViewIndex: this.state.childViewIndex + 1,
      },
      this.startNextAnimation,
    )
  }

  render() {
    const textYOffset = this.state.yOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.props.bounceHeight],
    })

    let childView = this.props.children
    if (Array.isArray(this.props.children)) {
      childView = this.props.children[
        this.state.childViewIndex % this.props.children.length
      ]
    }

    return (
      <Animated.View
        style={{
          marginTop: this.props.bounceHeight,
          transform: [{ translateY: textYOffset }],
        }}
      >
        {childView}
      </Animated.View>
    )
  }
}
