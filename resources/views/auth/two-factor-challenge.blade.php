<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Two Factor Challenge') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <script>
        // Redirect to Inertia page
        if (document.referrer.includes('login')) {
            window.location.href = "{{ route('login') }}";
        } else {
            window.location.href = "/";
        }
    </script>
    <div class="flex items-center justify-center min-h-screen">
        <p class="text-gray-600">{{ __('Redirecting...') }}</p>
    </div>
</body>
</html>
