<x-layouts::app.sidebar :title="$title ?? null">
    <flux:main>
        {{ $slot }}
    </flux:main>
</x-layouts::app.sidebar>
<script>
    window.Laravel = {
        props: @json($page['props'] ?? [])
    };
</script>
