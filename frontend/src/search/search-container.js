import React from 'react';
import {connect} from 'react-redux';
import SearchInput from './search-input';
import GameResultsBox from './game-results-box';
import {searchGame} from '../external-connectors';

const mockGameData = {"custom":false,"apiDetailUrl":"https://www.giantbomb.com/api/game/3030-49994/","deck":"Tri Force Heroes is a co-op game set in The Legend of Zelda franchise. Three Links must work together to rid the land of Hyrule of evil once more.","description":"<h2>Overview</h2><p>The Legend of Zelda: Tri Force Heroes is a co-op game in the style of <a href=\"/the-legend-of-zelda-four-swords-adventures/3030-7856/\" data-ref-id=\"3030-7856\">Four Swords</a> in which three <a href=\"/link/3005-191/\" data-ref-id=\"3005-191\">Links</a> traverse dungeons together to bring the \"style back\" to Hytopia. Players can customize their appearances to affect their abilities. The game can also be played in single player mode with the other two players replaced with dolls that the player can swap between.</p><h2>Reception</h2><p>Tri Force Heroes received mixed reviews upon release with general praise for the co-op gameplay but a more critical view on the singleplayer version of the campaign. Many players complained about lag during online matches. The game has sold 1.14 million copies worldwide as of March 31, 2016.</p><p> </p>","developers":null,"expectedReleaseDay":23,"expectedReleaseMonth":10,"expectedReleaseYear":2015,"franchises":null,"genres":null,"gbId":49994,"image":"https://www.giantbomb.com/api/image/scale_medium/2778000-tloztfh.jpg","name":"The Legend of Zelda: Tri Force Heroes","releases":null,"siteDetailUrl":"https://www.giantbomb.com/the-legend-of-zelda-tri-force-heroes/3030-49994/","platforms":[{"abbreviation":"3DS","apiDetailUrl":"https://www.giantbomb.com/api/platform/3045-117/","gbId":117,"name":"Nintendo 3DS","siteDetailUrl":"https://www.giantbomb.com/nintendo-3ds/3045-117/"},{"abbreviation":"3DSE","apiDetailUrl":"https://www.giantbomb.com/api/platform/3045-138/","gbId":138,"name":"Nintendo 3DS eShop","siteDetailUrl":"https://www.giantbomb.com/nintendo-3ds-eshop/3045-138/"}]};

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [mockGameData, mockGameData],
      loading: false
    };
  }

  searchGames = query => {
    this.setState({loading: true}, async () => {
      const resp = await searchGame(query);
      this.setState({searchResults: resp.games, loading: false});
    });
  };

  render() {
    return (
      <div>
        <SearchInput searchType="games"
                     setQuery={this.searchGames}
                     loading={this.state.loading}
        />
        <GameResultsBox games={this.state.searchResults} />
      </div>
    );
  }
}

const dispatchMap = {};

export default connect(null, dispatchMap)(SearchContainer);
