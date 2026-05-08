<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LegacyHttpTest extends TestCase
{

    public function test_legacy_app_is_responding_via_http()
    {

        $response = Http::withoutVerifying()->get('https://localhost');

        $this->assertEquals(200, $response->status(), "The legacy app did not return a 200 OK.");

        $this->assertStringContainsString('IDE21 Demo Page', $response->body());
        $this->assertStringContainsString('generator" content="NeT"', $response->body());

        $this->assertTrue($response->header('Server') !== '', "No Server header found.");

    }
    public function test_legacy_admin_panel_is_accessible(): void
    {
        $response = Http::withoutVerifying()->get('https://localhost/adm');

        $this->assertEquals(200, $response->status(), "The legacy app did not return a 200 OK for admin.");
    }
}
