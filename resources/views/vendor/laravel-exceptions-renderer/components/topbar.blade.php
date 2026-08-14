<div class="exception-topbar">
    <h1>{{ $title ?? 'Error' }}</h1>
    @if(!empty($markdown))
        <div class="markdown">{!! $markdown !!}</div>
    @endif
</div>
