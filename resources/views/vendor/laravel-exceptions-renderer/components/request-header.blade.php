@if(!empty($headers))
    <div class="exception-request-headers">
        <h3>Request Headers</h3>
        <pre>{{ print_r($headers, true) }}</pre>
    </div>
@endif
