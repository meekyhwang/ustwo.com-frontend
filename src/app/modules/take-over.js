import React from 'react';
import classnames from 'classnames';
import TransitionManager from 'react-transition-manager';

import Track from '../../server/adaptors/track';
import Flux from '../flux';

import CloseButton from '../elements/close-button';
import NewsFlash from '../elements/news-flash';

import {onClickContent} from '../modules/modal';

const takeover = {
  title: "Moodnotes - Out Now!",
  name: "Moodnotes",
  description: "Capture your feelings and improve your thinking habits",
  links: [{
    type: 'http',
    text: 'Download on iOS',
    url: 'http://us2.co/Moodnotes'
  }, {
    type: 'http',
    text: 'Go to moodnotesapp.com',
    url: 'http://moodnotes.thriveport.com/'
  }],
  image: 'images/home/moodnotes_takeover_image.png'
};

export default class TakeOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: false
    };
  }
  render = () => {
    let content;
    if(this.state.showContent) {
      content = (
        <div key="detail" className="take-over__content">
          <div className="take-over__content__message">
            <CloseButton onClose={this.onClickClose} className="take-over__content__message__close" autoAnim={1000} />
            <h1 className="take-over__content__message__title">{takeover.title}</h1>
            <p className="take-over__content__message__description">{takeover.description}</p>
            <ul className="take-over__content__message__links">
              {takeover.links.map(this.renderLink)}
            </ul>
          </div>
          <div className="take-over__content__image" style={{backgroundImage: `url(${takeover.image})`}}>
          </div>
        </div>
      );
    } else {
      content = (
        <div key="news-flash" className="take-over__news-flash">
          <NewsFlash className="take-over__news-flash__animation" autoAnim={50} loop={true} />
          <h1 className="take-over__news-flash__title">News</h1>
        </div>
      );
    }
    return (
      <TransitionManager className={`take-over ${this.props.className}`} component="div" duration={800} onClick={onClickContent}>
        {content}
      </TransitionManager>
    );
  }
  renderLink = (link, index) => {
    let prefix = "";
    switch(link.type) {
      case 'email':
        prefix = "mailto:";
      break;
      case 'tel':
        prefix = "tel:";
      break;
    }
    return <li className={`take-over__content__message__links__link-item ${link.type}`}><a className="take-over__content__message__links__link-item__link" href={`${prefix}${link.url}`} onClick={this.onClickLink(index)}>{link.text}</a></li>;
  }
  componentDidMount() {
    this.contentTimeout = setTimeout(() => {
      this.setState({
        showContent: true
      });
    }, 3000);
  }
  componentWillUnmount() {
    clearTimeout(this.contentTimeout);
  }
  onClickClose() {
    Track('send', {
      'hitType': 'event',          // Required.
      'eventCategory': 'takeover',   // Required.
      'eventAction': 'click_takeover_x',  // Required.
      'eventLabel': takeover.name // Name of the takeover as set in WordPress
    });
    Flux.closeTakeover();
  }
  onClickLink(index) {
    return (e) => {
      const target = e.currentTarget;
      e.preventDefault();
      Track('send', {
        'hitType': 'event',          // Required.
        'eventCategory': 'takeover',   // Required.
        'eventAction': 'click_link_' + index+1,  // Required.
        'eventLabel': takeover.name, // Name of the takeover as set in WordPress
        'hitCallback' : function() {
          window.location = target.href;
        }
      });
    }
  }
};
