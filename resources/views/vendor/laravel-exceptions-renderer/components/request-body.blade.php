@if(!empty($body))
    <div class="exception-request-body">
        <h3>Request Body</h3>
        <pre>{{ print_r($body, true) }}</pre>
    </div>
@endif
