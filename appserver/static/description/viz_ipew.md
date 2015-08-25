<h4>Requirements</h4>
<p>
    Install <a href="https://splunkbase.splunk.com/app/1924/#/overview" target="_blank">Splunk Eventgen app</a> to see a live demo of this dashboard. Rename the Eventgen app to <code>SA-eventgen</code> and restart Splunk. Note that the <code>eventgen.conf</code> from this app will generate one sample "attack" event to <code>index=main sourcetype=ipew_sample</code> every second.
</p>
<h4>Options</h4>
<table class="table table-striped table-bordered">
    <tbody>
        <tr>
            <td>
            <b>Name</b>
            </td>
            <td>
            <b>Type</b>
            </td>
            <td>
            <b>Default</b>
            </td>
            <td>
            <b>Description</b>
            </td>
        </tr>
        <tr>
            <td>
            <code>managerid</code>
            </td>
            <td>string</td>
            <td>null</td>
            <td>The search manager bound to the chart.</td>
        </tr>
        <tr>
            <td>
            <code>height</code>
            </td>
            <td>number</td>
            <td>800</td>
            <td>The height of the panel.</td>
        </tr>
        <tr>
            <td>
            <code>src_lat_field</code>
            </td>
            <td>string</td>
            <td>"src_lat"</td>
            <td>The name of the source's latitude field.</td>
        </tr>
        <tr>
            <td>
            <code>src_lon_field</code>
            </td>
            <td>string</td>
            <td>"src_lon"</td>
            <td>The name of the source's longitude field.</td>
        </tr>
        <tr>
            <td>
            <code>dst_lat_field</code>
            </td>
            <td>string</td>
            <td>"dst_lat"</td>
            <td>The name of the destination's latitude field.</td>
        </tr>
        <tr>
            <td>
            <code>dst_lon_field</code>
            </td>
            <td>string</td>
            <td>"dst_lon"</td>
            <td>The name of the destination's longitude field.</td>
        </tr>
        <tr>
            <td>
            <code>type_field</code>
            </td>
            <td>string</td>
            <td>"type"</td>
            <td>The name of the type field. This is what is shown in the hover popup at the destination's circle.</td>
        </tr>
        <tr>
            <td>
            <code>id_field</code>
            </td>
            <td>string</td>
            <td>"id"</td>
            <td>The name of the id field. The id should be a unique value for each event. One way to achieve this is with <code>md5(_raw)</code> in the search query.</td>
        </tr>
        <tr>
            <td>
            <code>sound_field</code>
            </td>
            <td>string</td>
            <td>"/static/app/custom_vizs/components/ipew/Blaster-Solo.wav"</td>
            <td>The relative web URL to the sound effect. Setting the value to <code>null</code> will disable the sound effect. This app provides the following files: <code>B5-interceptor1.wav</code>, <code>Blaster-Solo.wav</code>, <code>pew.mp3</code>, <code>shot_sound.mp3</code>, <code>tng_torpedo_clean.mp3</code>, and <code>WarGames-KeyPress.wav</code>.</td>
        </tr>
        <tr>
            <td>
            <code>stroke_color</code>
            </td>
            <td>string</td>
            <td>"green"</td>
            <td>The color of the attack line.</td>
        </tr>
        <tr>
            <td>
            <code>stroke_width</code>
            </td>
            <td>number</td>
            <td>2</td>
            <td>The width of the attack line.</td>
        </tr>
        <tr>
            <td>
            <code>queue</code>
            </td>
            <td>number</td>
            <td>7</td>
            <td>The maximum number of attack lines that are drawn at a given time on the map.</td>
        </tr>
        <tr>
            <td>
            <code>limit</code>
            </td>
            <td>number</td>
            <td>2</td>
            <td>The maximum number of new lines that are drawn per refresh of the real-time data. If there are more new events than the <code>limit</code>, then the extra events are ignored. It doesn't make sense to have a <code>limit</code> greater than the <code>queue</code>. Also note that setting a <code>limit</code> too high will degrade drawning performances.</td>
        </tr>
    </tbody>
</table>
