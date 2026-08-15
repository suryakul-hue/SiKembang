@extends('layouts.app')

@section('content')
<div class="flex items-center justify-center min-h-screen bg-gray-50">
    <script>
        // Redirect to Inertia login page
        window.location.href = "{{ route('login') }}";
    </script>
    <p>{{ __('Redirecting...') }}</p>
</div>
@endsection
