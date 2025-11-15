import { Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '29',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 team members',
        '10 GB storage',
        'Basic analytics',
        'Email support',
        'Mobile app access',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '79',
      description: 'For growing businesses and teams',
      features: [
        'Up to 25 team members',
        '100 GB storage',
        'Advanced analytics',
        'Priority support',
        'Mobile app access',
        'Custom integrations',
        'API access',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '199',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Advanced analytics',
        '24/7 phone support',
        'Mobile app access',
        'Custom integrations',
        'API access',
        'Dedicated account manager',
        'Custom SLA',
      ],
      popular: false,
    },
  ];

  return (
    <div className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 text-lg">
            Choose the perfect plan for your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 relative ${
                plan.popular ? 'border-2 border-blue-600 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-slate-900">$</span>
                  <span className="text-slate-900">{plan.price}</span>
                  <span className="text-slate-600">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                Start Free Trial
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-slate-600 mt-8">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}
