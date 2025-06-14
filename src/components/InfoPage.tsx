import React from 'react';
import { ArrowLeft, Home, Calendar, Users, Trophy, BookOpen, Gamepad2, Globe } from 'lucide-react';

interface InfoPageProps {
  page: string;
  onBackToHome: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ page, onBackToHome }) => {
  const getPageContent = () => {
    switch (page) {
      case 'pokemon-history':
        return {
          title: 'Pokemon History',
          icon: <BookOpen className="w-8 h-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">The Beginning (1996)</h3>
                <p className="comic-text text-lg text-white leading-relaxed mb-4">
                  Pokemon began in 1996 with Pokemon Red and Green in Japan, created by Satoshi Tajiri and Game Freak. 
                  The franchise has since become one of the most successful media franchises in the world.
                </p>
                <p className="comic-text text-lg text-white leading-relaxed">
                  The concept was inspired by Tajiri's childhood hobby of collecting insects, which he wanted to 
                  recreate for urban children who might not have access to nature.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">Evolution Through Time</h3>
                <p className="comic-text text-lg text-white leading-relaxed mb-4">
                  From humble beginnings on the Game Boy to the modern Nintendo Switch, Pokemon has evolved 
                  while maintaining its core message of friendship, adventure, and discovery.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="comic-text font-bold text-pokemon-red mb-2">Game Boy Era (1996-2002)</h4>
                    <p className="comic-text text-white">Red, Blue, Yellow, Gold, Silver, Crystal</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="comic-text font-bold text-pokemon-red mb-2">Modern Era (2017-Present)</h4>
                    <p className="comic-text text-white">Nintendo Switch brings Pokemon to new heights</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">Cultural Impact</h3>
                <p className="comic-text text-lg text-white leading-relaxed">
                  Pokemon has transcended gaming to become a global phenomenon, inspiring TV shows, movies, 
                  trading cards, toys, and countless other products. The franchise has taught generations 
                  about friendship, perseverance, and the joy of discovery.
                </p>
              </div>
            </div>
          )
        };

      case 'game-generations':
        return {
          title: 'Pokemon Generations',
          icon: <Calendar className="w-8 h-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">Understanding Pokemon Generations</h3>
                <p className="comic-text text-lg text-white leading-relaxed mb-4">
                  Pokemon games are organized into generations, each introducing new regions, Pokemon, and gameplay mechanics. 
                  Each generation represents a significant step forward in the franchise's evolution.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Generation 4 (Diamond/Pearl/Platinum)</h3>
                  <div className="space-y-2">
                    <p className="comic-text text-white"><strong>Region:</strong> Sinnoh</p>
                    <p className="comic-text text-white"><strong>Platform:</strong> Nintendo DS</p>
                    <p className="comic-text text-white"><strong>Key Features:</strong></p>
                    <ul className="comic-text text-gray-300 ml-4 space-y-1">
                      <li>• Physical/Special split mechanic</li>
                      <li>• Online trading via WiFi</li>
                      <li>• Underground exploration</li>
                      <li>• Legendary Pokemon: Dialga, Palkia, Giratina</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Generation 7 (Sun/Moon)</h3>
                  <div className="space-y-2">
                    <p className="comic-text text-white"><strong>Region:</strong> Alola</p>
                    <p className="comic-text text-white"><strong>Platform:</strong> Nintendo 3DS</p>
                    <p className="comic-text text-white"><strong>Key Features:</strong></p>
                    <ul className="comic-text text-gray-300 ml-4 space-y-1">
                      <li>• Z-Moves system</li>
                      <li>• Island Trials replace Gyms</li>
                      <li>• Alolan Forms</li>
                      <li>• Festival Plaza</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Generation 8 (Sword/Shield)</h3>
                  <div className="space-y-2">
                    <p className="comic-text text-white"><strong>Region:</strong> Galar</p>
                    <p className="comic-text text-white"><strong>Platform:</strong> Nintendo Switch</p>
                    <p className="comic-text text-white"><strong>Key Features:</strong></p>
                    <ul className="comic-text text-gray-300 ml-4 space-y-1">
                      <li>• Dynamax and Gigantamax</li>
                      <li>• Wild Area exploration</li>
                      <li>• Max Raid Battles</li>
                      <li>• DLC expansions</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Generation 9 (Scarlet/Violet)</h3>
                  <div className="space-y-2">
                    <p className="comic-text text-white"><strong>Region:</strong> Paldea</p>
                    <p className="comic-text text-white"><strong>Platform:</strong> Nintendo Switch</p>
                    <p className="comic-text text-white"><strong>Key Features:</strong></p>
                    <ul className="comic-text text-gray-300 ml-4 space-y-1">
                      <li>• Open-world gameplay</li>
                      <li>• Three interconnected storylines</li>
                      <li>• Terastallization</li>
                      <li>• Co-op multiplayer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        };

      case 'nintendo-switch':
        return {
          title: 'Nintendo Switch Pokemon',
          icon: <Gamepad2 className="w-8 h-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">Pokemon on Nintendo Switch</h3>
                <p className="comic-text text-lg text-white leading-relaxed mb-4">
                  The Nintendo Switch has revolutionized Pokemon gaming by bringing console-quality experiences 
                  to both home and portable play. This hybrid approach perfectly matches Pokemon's philosophy 
                  of adventure and exploration.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Enhanced Graphics</h3>
                  <p className="comic-text text-white leading-relaxed">
                    Switch Pokemon games feature stunning HD graphics, detailed environments, and smooth animations 
                    that bring the Pokemon world to life like never before.
                  </p>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Seamless Connectivity</h3>
                  <p className="comic-text text-white leading-relaxed">
                    Online trading, battles, and multiplayer features are more accessible than ever with 
                    Nintendo Switch Online integration and local wireless play.
                  </p>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Play Anywhere</h3>
                  <p className="comic-text text-white leading-relaxed">
                    The Switch's portable nature means you can catch Pokemon at home on the big screen 
                    or take your adventure on the go - perfect for the Pokemon lifestyle.
                  </p>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Innovation</h3>
                  <p className="comic-text text-white leading-relaxed">
                    From Let's Go's motion controls to Legends Arceus's new catching mechanics, 
                    Switch Pokemon games continue to innovate while respecting the series' legacy.
                  </p>
                </div>
              </div>
            </div>
          )
        };

      case 'pokemon-trading':
        return {
          title: 'Pokemon Trading',
          icon: <Users className="w-8 h-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">The Heart of Pokemon</h3>
                <p className="comic-text text-lg text-white leading-relaxed mb-4">
                  Trading has been a cornerstone of Pokemon since the beginning. The motto "Gotta Catch 'Em All" 
                  encourages players to connect and trade with others to complete their Pokedex.
                </p>
                <p className="comic-text text-lg text-white leading-relaxed">
                  Trading isn't just about completing the Pokedex - it's about building friendships and 
                  sharing the joy of Pokemon with others around the world.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Local Trading</h3>
                  <p className="comic-text text-white leading-relaxed mb-3">
                    Connect with friends nearby using local wireless communication. Perfect for trading 
                    with family members or friends in the same room.
                  </p>
                  <ul className="comic-text text-gray-300 space-y-1">
                    <li>• No internet required</li>
                    <li>• Fast and reliable</li>
                    <li>• Great for beginners</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Online Trading</h3>
                  <p className="comic-text text-white leading-relaxed mb-3">
                    Connect with trainers worldwide through Nintendo Switch Online. Trade with anyone, 
                    anywhere, at any time.
                  </p>
                  <ul className="comic-text text-gray-300 space-y-1">
                    <li>• Global reach</li>
                    <li>• Wonder Trade features</li>
                    <li>• Surprise encounters</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Special Events</h3>
                  <p className="comic-text text-white leading-relaxed">
                    Participate in community events, trading competitions, and special distributions 
                    that bring trainers together for unique Pokemon experiences.
                  </p>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Building Connections</h3>
                  <p className="comic-text text-white leading-relaxed">
                    Trading creates lasting friendships and memories. Many trainers have met lifelong 
                    friends through Pokemon trading and continue to share their adventures together.
                  </p>
                </div>
              </div>
            </div>
          )
        };

      case 'game-reviews':
        return {
          title: 'Game Reviews',
          icon: <Trophy className="w-8 h-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">Critical Acclaim</h3>
                <p className="comic-text text-lg text-white leading-relaxed mb-4">
                  Pokemon games consistently receive high ratings for their engaging gameplay, memorable characters, 
                  and innovative features. Critics praise the series for its accessibility to new players while 
                  offering depth for veterans.
                </p>
                <p className="comic-text text-lg text-white leading-relaxed">
                  Each generation introduces new mechanics while respecting the franchise's legacy, 
                  creating experiences that feel both fresh and familiar.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Professional Reviews</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="comic-text text-pokemon-yellow font-bold">Pokemon Legends Arceus</p>
                      <p className="comic-text text-white">★★★★★ "Revolutionary gameplay mechanics"</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="comic-text text-pokemon-yellow font-bold">Pokemon Scarlet/Violet</p>
                      <p className="comic-text text-white">★★★★☆ "Open-world innovation"</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="comic-text text-pokemon-yellow font-bold">Pokemon Sword/Shield</p>
                      <p className="comic-text text-white">★★★★☆ "Beautiful Galar region"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Player Feedback</h3>
                  <p className="comic-text text-white leading-relaxed mb-3">
                    Player reviews highlight the emotional connections formed with Pokemon partners and 
                    the satisfaction of completing challenging battles and puzzles.
                  </p>
                  <ul className="comic-text text-gray-300 space-y-1">
                    <li>• "Amazing storylines and characters"</li>
                    <li>• "Perfect for both kids and adults"</li>
                    <li>• "Endless replay value"</li>
                    <li>• "Great multiplayer features"</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">What Critics Love</h3>
                  <ul className="comic-text text-white space-y-2">
                    <li>• Innovative gameplay mechanics</li>
                    <li>• Beautiful art direction and music</li>
                    <li>• Strong narrative elements</li>
                    <li>• Excellent multiplayer integration</li>
                    <li>• Accessibility for all skill levels</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Awards & Recognition</h3>
                  <p className="comic-text text-white leading-relaxed">
                    Pokemon games have won numerous awards including Game of the Year nominations, 
                    Best Family Game awards, and recognition for innovation in portable gaming.
                  </p>
                </div>
              </div>
            </div>
          )
        };

      case 'pokemon-community':
        return {
          title: 'Pokemon Community',
          icon: <Globe className="w-8 h-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                <h3 className="comic-font text-2xl text-pokemon-yellow mb-4">A Global Family</h3>
                <p className="comic-text text-lg text-white leading-relaxed mb-4">
                  The Pokemon community spans generations, bringing together players of all ages through 
                  shared adventures and experiences. The community's welcoming nature reflects the 
                  series' core values of friendship and cooperation.
                </p>
                <p className="comic-text text-lg text-white leading-relaxed">
                  From local Pokemon leagues to international championships, the community showcases 
                  both casual fun and competitive excellence.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Competitive Play</h3>
                  <p className="comic-text text-white leading-relaxed mb-3">
                    Pokemon's competitive scene showcases the strategic depth beneath the friendly exterior. 
                    World Championships bring together the best trainers from around the globe.
                  </p>
                  <ul className="comic-text text-gray-300 space-y-1">
                    <li>• Official tournaments worldwide</li>
                    <li>• VGC (Video Game Championships)</li>
                    <li>• Local league competitions</li>
                    <li>• Online ranked battles</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Creative Community</h3>
                  <p className="comic-text text-white leading-relaxed mb-3">
                    Fans express their love for Pokemon through art, music, stories, and videos. 
                    The creative community keeps the Pokemon spirit alive between game releases.
                  </p>
                  <ul className="comic-text text-gray-300 space-y-1">
                    <li>• Fan art and illustrations</li>
                    <li>• Music covers and remixes</li>
                    <li>• Fanfiction and stories</li>
                    <li>• YouTube content creators</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Helpful Community</h3>
                  <p className="comic-text text-white leading-relaxed">
                    Online communities share strategies, help newcomers, trade Pokemon, and provide 
                    support for players of all levels. Forums, Discord servers, and social media 
                    groups create spaces for every type of Pokemon fan.
                  </p>
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 comic-border backdrop-blur-sm">
                  <h3 className="comic-font text-xl text-pokemon-red mb-3">Real-World Events</h3>
                  <p className="comic-text text-white leading-relaxed">
                    Pokemon GO brought the community into the real world with meetups, raids, and 
                    community days. These events create lasting friendships and shared memories 
                    beyond the digital realm.
                  </p>
                </div>
              </div>
            </div>
          )
        };

      default:
        return {
          title: 'Page Not Found',
          icon: <BookOpen className="w-8 h-8" />,
          content: (
            <div className="text-center py-12">
              <p className="comic-text text-xl text-white">This page doesn't exist yet!</p>
            </div>
          )
        };
    }
  };

  const pageData = getPageContent();

  return (
    <main className="container mx-auto px-4 py-8 relative z-10 min-h-screen">
      {/* Back Navigation */}
      <div className="mb-8">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-3 bg-pokemon-yellow hover:bg-yellow-400 
                   text-black font-bold py-3 px-6 rounded-full comic-border 
                   comic-text text-lg transform hover:scale-105 transition-all 
                   duration-300 comic-button comic-shadow"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-pokemon-yellow">
            {pageData.icon}
          </div>
          <h1 className="comic-font text-4xl md:text-5xl text-pokemon-red">
            {pageData.title}
          </h1>
          <div className="text-pokemon-yellow">
            {pageData.icon}
          </div>
        </div>
        <div className="w-32 h-1 bg-pokemon-yellow mx-auto rounded-full"></div>
      </div>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto">
        {pageData.content}
      </div>

      {/* Quick Navigation */}
      <div className="mt-12 text-center">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 bg-pokemon-red hover:bg-red-600 
                   text-white font-bold py-3 px-6 rounded-full comic-border 
                   comic-text text-lg transform hover:scale-105 transition-all 
                   duration-300 comic-button mx-auto"
        >
          <Home className="w-5 h-5" />
          Return to Shop
        </button>
      </div>
    </main>
  );
};

export default InfoPage;