<?php

namespace Tests\Feature;

use Tests\TestCase;

class EducationPageTest extends TestCase
{
    public function test_education_page_is_accessible(): void
    {
        $response = $this->get('/education');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Education/Index'));
    }
}
