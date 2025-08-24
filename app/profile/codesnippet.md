## header

{/_ Header _/}
<div className="flex flex-col sm:flex-row sm:items-center gap-4">
<Avatar className="h-16 w-16 ring-1 ring-white/20">
<AvatarImage
src={form.imageUrl}
alt={form.name || "Avatar"}
/>
<AvatarFallback className="bg-white/10 text-white">
{initials}
</AvatarFallback>
</Avatar>
<div>
<div className="text-2xl font-semibold">
{profile?.name ?? "New Darviz user"}
</div>
<div className="text-sm text-white/60">
{profile?.email ?? "—"}
</div>
<div className="mt-2 flex items-center gap-2">
<Badge
                          variant="secondary"
                          className="text-white bg-white/10"
                        >
{profile?.plan ?? "Free"}
</Badge>
</div>
</div>
</div>

## plan change

<div className="grid gap-2">
                      <Label className="text-white/80">Plan</Label>
                      <Select
                        value={form.plan}
                        onValueChange={(val) =>
                          setForm((s) => ({ ...s, plan: val }))
                        }
                        disabled={!editing}
                      >
                        <SelectTrigger className="border-white/10 bg-white/5 text-white focus-visible:ring-2 focus-visible:ring-[#0099FF]">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover text-popover-foreground">
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Pro">Pro</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
