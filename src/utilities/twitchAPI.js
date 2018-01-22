import axios from 'axios';
//import {normalize} from 'normalizr';
//import {taskSchema} from '../modules/tasks';

const schedulerAPI = axios.create({baseURL: 'https://api.twitch.tv/helix/'});

const blacklist = [
  'the',
  'and',
  'only',
  'with',
  'do',
  'is',
  'to',
  'of',
  'no',
  'on',
  'for',
  'by',
  'or',
  'at',
  'from',
  'in',
  'it',
];

export const getTwitchisms = async (pages = 10, count = 50) => {
    let streamData = {};
    let streamDataPage;
    let options = {
        headers: {
            'Client-ID': '751gd7ryqo1msp5bpmipdf6ke22kha'
        },
        params: {
            first: 100
        }
    };
    for (let i = 0; i < pages; i++) {
        streamDataPage = await schedulerAPI.get('streams', options);
        streamDataPage.data.data.forEach(stream => {
            streamData[stream.id] = stream;
        });
        options.params.after = streamDataPage.data.pagination.cursor;
    }
    let twitchisms = {};
    for (let streamId in streamData) {
      let stream = streamData[streamId];
      stream.title.split(' ').forEach(word => {
        word = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (word.length > 1 && blacklist.indexOf(word) === -1 && !word.match(/^[0-9]+$/)) {
          let twitchism = twitchisms[word];
          if (twitchism) {
            twitchism.count++; // += stream.viewer_count;
          } else {
            twitchisms[word] = {
              word,
              count: 1, // stream.viewer_count
              pos: {
                x: Math.random(),
                y: Math.random()
              }
            };
          }
        }
      });
    }
    let sortedTwitchisms = Object.values(twitchisms).sort((a, b) => (b.count - a.count)).slice(0, count);

    let min = 0;
    let max = 0;
    let slope = 0;
    let intercept = 0;
    if (sortedTwitchisms && sortedTwitchisms.length > 0) {
      min = sortedTwitchisms[sortedTwitchisms.length - 1].count;
      max = sortedTwitchisms[0].count;
      slope = (40 - 10)/(max - min);
      intercept = 10 - (slope*min);
    }

    twitchisms = {};
    sortedTwitchisms.forEach((twitchism) => {
        twitchism.weight = (slope * twitchism.count) + intercept;
        twitchisms[twitchism.word] = twitchism;
    });
    return twitchisms;
}
