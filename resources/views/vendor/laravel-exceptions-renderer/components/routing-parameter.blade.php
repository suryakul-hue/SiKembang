@if(!empty($routeParameters))
    <div class="exception-route-parameters">
        <h3>Route Parameters</h3>
        <pre>{{ print_r($routeParameters, true) }}</pre>
    </div>
@endif
