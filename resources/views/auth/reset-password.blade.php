<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Reset Password') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <script>
        // Redirect to Inertia page
        window.location.href = "{{ route('password.request') }}";
    </script>
    <div class="flex items-center justify-center min-h-screen">
        <p class="text-gray-600">{{ __('Redirecting...') }}</p>
    </div>
</body>
</html>
