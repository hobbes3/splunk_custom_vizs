<dashboard script="tutorial.js" showsource="false">
  <label>Tutorial</label>
  <row>
    <panel>
      <html>
        <h2>App Info</h2>
        <p>This app (<code>custom_vizs</code>) is simply a convenient reference for many custom JS visualizations. Most of them are not created by me (hobbes3). Please see the Sources section below for credits.</p>
        <h2>JS Info</h2>
        <p>
          Custom JS visualizations can be used in Splunk by including special JS files that extends and modifies the <code>SimpleSplunkView</code> SplunkJS object. All custom JS (and other static files like CSS and images) goes in the app's <code>appserver/static/</code> folder. These JS are then called from SimpleXML. Creating the JS files require server access, but <i>using</i> the custom visualization only require access to Splunk UI (SimpleXML).
        </p>
        <h2>Instructions</h2>
        <ul>
          <li>If you don't want to depend on this app, then copy the necessary files in <code>custom_viz/appserver/static/&lt;js_viz&gt;/</code> and <code>autodiscover.js</code> to your own app's <code>appserver/static/</code>. Some visualizations like the globe uses its own, unique <code>autodiscover.js</code> file.</li>
          <li>At the top of your dashboard load <code>autodiscover.js</code> like <code>&lt;form script="autodiscover.js"&gt;</code>.</li>
          <li>Call the custom visualization using 2 <code>&lt;div&gt;</code>'s in a HTML panel (see <b>SimpleXML Declaration</b> below).</li>
        </ul>  
      </html>
    </panel>
  </row>
  <row>
    <panel>
      <html>
        <h2>SimpleXML Declaration</h2>
        <img src="/static/app/custom_vizs/tutorial.png" width="1000px"/>
      </html>
    </panel>
  </row>
  <row>
    <panel>
      <html>
        <h2>Tips</h2>
        <ul>
          <li>Making any dashboard modifications via "Edit Panels" <i>will destroy any custom formatting</i> in the two <code>&lt;div&gt;</code>'s (Splunk will make each <code>&lt;div&gt;</code> into a single line and escape a bunch for characters). One way around this is to keep a copy of the formatted <code>&lt;div&gt;</code>'s before using "Edit Panels".</li>
          <li>To really understand how the custom visualization JS code works, use a browser dev tool and set breakpoints in various lines (especially inside <code>createView</code>, <code>formatData</code>, and <code>updateView</code> of the extended <code>SimpleSplunkView</code> code).</li>
          <li>To use a saved search or post process search, use <code>splunkjs/mvc/savedsearchmanager</code> or <code>splunkjs/mvc/postprocessmanager</code>, respectively. Note that these both require <code>managerid</code>.</li>
          <li>More info about various SplunkJS objects:
            <ul>
              <li><a href="http://docs.splunk.com/DocumentationStatic/WebFramework/1.1/compref_simplesplunk.html">SimpleSplunkView</a></li>
              <li><a href="http://docs.splunk.com/DocumentationStatic/WebFramework/1.1/compref_searchmanager.html">SearchManager</a></li>
              <li><a href="http://docs.splunk.com/DocumentationStatic/WebFramework/1.1/compref_savedsearchmanager.html">SavedSearchManager</a></li>
              <li><a href="http://docs.splunk.com/DocumentationStatic/WebFramework/1.1/compref_postprocessmanager.html">PostProcessManager</a></li>
              <li>All SplunkJS objects are located in <code>$SPLUNKHOME$/share/splunk/search_mrsparkle/exposed/js/splunkjs/mvc/</code>.</li>
            </ul>
          </li>
        </ul>
        <h2>Troubleshooting</h2>
        <ul>
          <li>Check that the <code>managerid</code> matches the id of the <code>searchmanager</code>'s <code>&lt;div&gt;</code>.</li>
          <li>Check for the correct path for <code>data-require</code> for the visualization "container" <code>&lt;div&gt;</code>. It should be in the form of <code>app/&lt;app_name&gt;/path/to/&lt;js_file_without_extension&gt;</code>.</li>
          <li>Check that all XML attributes are properly escaped. For example, make sure all <code>'&lt;&gt;"\</code> characters are escaped in the search query.</li>
          <li>Check that all tokens are wrapped in the <code>token_safe</code> syntax and are defined by 2 dollar signs on each side (like <code>$$$$token$$$$</code>).</li>
          <li>Check that the value of <code>data-options</code> is in valid JS object (not necessary JSON since single quotes can be used). In other words, check for comma and quote placements.</li>
          <li>Check for any JS errors in the browser (via some dev tool).</li>
          <li>If all else fail then start with the working examples then modify it in small steps to see where it breaks.</li>
        </ul>
        <h2>Sources</h2>
        <ul>
          <li><a href="https://splunkbase.splunk.com/app/1603/">Splunk 6.x Dashboard Examples</a></li>
          <li><a href="https://splunkbase.splunk.com/app/1613/">Splunk Web Framework Toolkit</a></li>
          <li><a href="https://splunkbase.splunk.com/app/1741/">Gantt Chart visualization</a></li>
          <li><a href="http://bost.ocks.org/mike/uberdata/">Uber Rides by Neighborhood</a></li>
          <li><a href="https://www.chromeexperiments.com/globe">WebGL Globe - Chrome Experiments</a></li>
          <li><a href="http://bl.ocks.org/mbostock/4339083">Collapsible Tree</a></li>
          <li><a href="http://bl.ocks.org/jensgrubert/7789216">D3.js Boxplot with Axes and Labels</a></li>
          <li><a href="http://bl.ocks.org/mbostock/2066415">Hive Plot (Links)</a></li>
        </ul>
        <h2>Thanks to</h2>
        <ul>
          <li><b>Itay Neeman</b>: The person who got me all started with Splunk + JS during one of the App Summits.</li>
          <li><b>David Foster</b>, <b>Matthew Elting</b>, and <b>Siegfried Puchbauer</b>: Our brilliant devs who are nice enough to answer some of my stupid questions.</li>
          <li><b>Genti Zaimi</b>, <b>Thomas Mann</b>, and <b>Roy Moranz</b>: My current and previous managers for supporting my SplunkJS journey.</li>
          <li><b>Misty Gibbs</b>: Allowing me to speak at Splunk's .conf.</li>
          <li><b>Vladimir Skoryk</b> and <b>Jackson Sie</b>: Helped me here and there.</li>
          <li><b>Tom LaGatta</b> and <b>Stepehen Sorkin</b>: Boxplot, enough said.</li>
          <li><b>Grigori Melnik</b>: Gave me some practice on how to explain how to create and use custom JS visualizations to others.</li>
          <li><b>Alexandar Johnson</b>: Helped me a lot on the source code viewer (ported from the Dashboard 6.x Examples App).</li>
        </ul>
      </html>
    </panel>
  </row>
</dashboard>